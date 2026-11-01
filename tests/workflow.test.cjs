const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\nrender\(\);\s*$/, '');
const elements = new Map();
const element = id => {
  if (!elements.has(id)) elements.set(id, {textContent:'', value:'', dataset:{}, attributes:{}, setAttribute(name,value){this.attributes[name]=String(value);}, focus(){this.focused=true;}, select(){}, setCustomValidity(message){this.validationMessage=message;}, reportValidity(){return !this.validationMessage;}, querySelector:()=>({textContent:''}), close(){this.open=false;}, showModal(){this.open=true;}});
  return elements.get(id);
};
const handlers=new Map();
const context = vm.createContext({
  console, document: {getElementById:element, addEventListener(type,handler){handlers.set(type,handler);}},
  localStorage: {getItem:()=>null, setItem(){}}, setTimeout(){}
});
vm.runInContext(script, context);
vm.runInContext('render = () => {}; announce = () => {}; drawMarketGraph = () => {};', context);
const run = code => vm.runInContext(code, context);
const truth = code => assert.equal(run(code), true, code);
// Every lesson and scene still renders, including empty class data.
for (const [lesson, count] of [4,4,3,2].entries()) {
  for (let scene=0; scene<count; scene++) {
    run(`state=fresh();state.session=${lesson};state.scene[${lesson}]=${scene};`);
    truth('typeof view().body === "string" && view().body.length > 100');
    truth('validState(state)');
  }
}
// Reveals, point selection, validation, line connection, and comparison stay separate.
for (const scenario of ['dplus','dminus','splus','sminus']) {
  run(`state=fresh();state.session=2;state.scene[2]=${scenario[0]==='d'?0:1};shiftReset('${scenario[0]}','${scenario}');`);
  truth('view().action === "showNewTable" && plotProgress().step === 0');
  truth('!view().body.includes("<table") && !view().body.includes("plotSvg")');
  run('act("showNewTable");');
  truth('plotProgress().step === 1 && !currentPlot().compare && !currentPlot().line');
  truth('view().body.includes("<table") && view().body.includes("plotSvg")');
  truth('!view().body.includes("curve old") && !view().body.includes("curve d") && !view().body.includes("curve s")');
  run('currentPlot().candidate={q:27,p:1000};act("confirmPoint");');
  truth('currentPlot().points.length===0 && currentPlot().message.length>0 && currentPlot().candidate.q===27');
  run('$("closePointErrorBtn").onclick();');
  for (let row=0;row<5;row++) {
    run(`currentPlot().row=${row};act('selectCoordinate');`);
    truth(`currentPlot().points.length===${row} && currentPlot().candidate!==null`);
    assert.equal(element('actionBtn').focused,true);
    run('act("confirmPoint");');
    truth(`currentPlot().points.length===${row+1} && currentPlot().candidate===null`);
    truth('!view().body.includes("plotSvg")');
    if (row < 4) truth('view().action === "nextPlotRow"');
  }
  truth('view().action === "connect" && plotProgress().step === 2 && !currentPlot().line');
  run('act("connect");');
  truth('currentPlot().line && !currentPlot().compare && view().action==="compareOld"');
  run('act("compareOld");');
  truth('currentPlot().compare && view().action==="advanceScene" && view().body.includes("curve old")');
  run('undo();');truth('!currentPlot().compare && currentPlot().line');
  run('undo();');truth('!currentPlot().line && currentPlot().points.length===5');
  truth('validState(state)');
}
// Real data remains unmodified even when quantities are equal or non-monotonic.
run('state=fresh();state.survey.values=[8,null,8,15,null];state.scene[0]=1;');
for (const row of [0,2,3]) run(`currentPlot().row=${row};act('selectCoordinate');act('confirmPoint');`);
truth('view().action==="connect"');run('act("connect");');
truth('state.survey.values.join(",")==="8,,8,15," && currentPlot().line && validState(state)');
// Price adjustment and all four new equilibria keep their economics intact.
for (const scenario of ['dplus','dminus','splus','sminus']) {
  run(`state=fresh();state.session=3;newReset('${scenario}');act('newReveal');act('newReveal');`);
  for(let i=0;i<3&&run('view().action==="newStep"');i++) run('act("newStep");act("newReveal");');
  truth('view().action==="newCompare"');run('act("newCompare");');
  truth('state.newMarket.compared && validState(state)');
}
console.log('PASS: 13 scenes, 4 plotting scenarios, point validation/reveal/undo, real class data, 4 new equilibria');

// The survey records one price at a time, retaining earlier answers and real values.
run('state=fresh();act("openSurvey");');
truth('state.survey.row===0 && $("surveyDialog").open && $("surveyPrice").textContent==="1,000원"');
truth('view().action==="openSurvey"');
assert.equal(element('surveyPriceEnding').textContent,'입니다.');
assert.ok(!run("view().body").includes('class="rail"'));
for (const invalid of ['', '-1', '1.5', '25']) {
  element('responseCount').value=invalid;
  element('surveyForm').onsubmit({preventDefault(){}});
  truth('state.survey.row===0 && state.survey.values[0]===null && $("surveyDialog").open');
}
element('classSize').value='3';element('responseCount').value='2';
element('surveyForm').onsubmit({preventDefault(){}});
truth('state.survey.values[0]===null && state.survey.size===24');
element('classSize').value='24';
const answers=[0,24,9,12,5];
for(let row=0;row<5;row++) {
  element('responseCount').value=String(answers[row]);
  element('surveyForm').onsubmit({preventDefault(){}});
  truth(`state.survey.values[${row}]===${answers[row]} && state.survey.row===${Math.min(row+1,4)}`);
  assert.equal(element('surveyDialog').open,row<4);
  if(row<4) assert.equal(element('surveyPriceEnding').textContent,'으로 올랐습니다.');
  truth('validState(state)');
}
run('openSurvey(2);');
assert.equal(element('surveyPriceEnding').textContent,'입니다.');
assert.equal(String(element('responseCount').value),'9');
element('responseCount').value='10';
element('surveyForm').onsubmit({preventDefault(){}});
truth('state.survey.values.join(",")==="0,24,10,12,5"');
run('$("surveyDialog").close();state=fresh();state.survey.values=[3,null,null,null,null];act("sample");act("openSurvey");');
truth('state.survey.mode==="class" && state.survey.values[0]===3 && state.survey.row===1');
console.log('PASS: survey dialog order, invalid input, zero, completion, editing and example isolation');

// Three top-level activities share the existing records and connect in order.
truth('activities.map(a=>a.name).join("|")==="수요곡선 만들기|공급곡선 만들기|시장 균형 확인하기"');
run('state=fresh();state.survey.values=[2,24,12,null,null];nextScene();');
truth('currentActivity()===0 && currentScene()===1');
truth('nextSceneLabel()==="공급곡선 만들기 →"');
run('nextScene();');truth('currentActivity()===1 && currentScene()===2');
run('nextScene();');truth('currentActivity()===1 && currentScene()===3');
truth('nextSceneLabel()==="시장 균형 확인하기 →"');
run('nextScene();');truth('currentActivity()===2 && currentScene()===0');
run('previousScene();');truth('currentActivity()===1 && currentScene()===3');
run('navigateSession(1);');truth('currentScene()===3');
run('navigateSession(0);');truth('currentActivity()===0 && currentScene()===1');
run('navigateSession(2);nextScene();nextScene();nextScene();nextScene();');
truth('currentActivity()===2 && currentScene()===3 && $("endDialog").open');
truth('state.survey.values.join(",")==="2,24,12,," && validState(state)');
run('navigateSession(3);');truth('state.session===1');
// Old exports and saved positions in removed lessons reopen an available activity.
for(const lesson of [2,3]) {
  run(`state.session=${lesson};restoreActivity();`);
  truth('state.session===0 && state.survey.values.join(",")==="2,24,12,," && validState(state)');
}
console.log('PASS: three activity navigation, cross-activity next/previous, completion and legacy record preservation');


// Completed data has a useful primary action; empty plotting can recover into the survey.
run('state=fresh();state.survey.values=[2,24,12,1,2];');
truth('view().action==="advanceScene" && view().label==="수요 점 찍기 →"');
run('state=fresh();state.scene[0]=1;');truth('view().action==="startSurvey" && !view().disabled');
run('state.survey.values=[null,4,2,null,null];');truth('view().action==="nextPlotRow" && !view().disabled');
run('act("nextPlotRow");');truth('currentPlot().row===1');
// Old guide flags remain importable but no controls or saved guide lines are shown.
run('state=fresh();state.survey.values=[2,24,12,1,2];state.scene[0]=1;');
for(const hint of [1,2,3]) {
 run(`currentPlot().hint=${hint};`);
 truth('validState(state) && !canUndo()');
 assert.ok(!run('view().body').includes('data-act="hintX"'));
 assert.ok(!run('view().body').includes('data-act="hintY"'));
 assert.equal((run('view().body').match(/class="coord-guide"/g)||[]).length,0);
}
// A modal draft survives closing/reopening and disappears only after it is recorded.
run('state=fresh();surveyDrafts.clear();surveyDrafts.set(1,"17");openSurvey(1);');
assert.equal(String(element('responseCount').value),'17');
run('$("surveyDialog").close();openSurvey(1);');assert.equal(String(element('responseCount').value),'17');
element('responseCount').value='17';run('recordSurveyResponse();');
truth('state.survey.values[1]===17 && !surveyDrafts.has(1)');
// Example mode must restore the real class size as well as responses.
run('state=fresh();state.survey.size=12;state.survey.values=[10,8,4,2,0];act("sample");');
truth('state.survey.mode==="example" && state.survey.size===20 && view().action==="advanceScene"');
run('act("sample");');truth('state.survey.size===12 && state.survey.values.join(",")==="10,8,4,2,0" && validState(state)');
// Equal quantities render a single readable marker; reaching equilibrium continues the activity.
run('state=fresh();state.survey.values=DEMAND.slice();state.dplot={...freshPlot(),points:[0,1,2,3,4],line:true};state.splot={...freshPlot(),points:[0,1,2,3,4],line:true};state.session=1;state.scene[1]=3;state.market[3].level=1;');
assert.equal((run('view().body').match(/<circle/g)||[]).length,1);
run('state.market[3].level=3;');truth('view().action==="showEquilibria" && !view().disabled');
assert.equal((run('view().body').match(/<circle/g)||[]).length,1);
run('state.scene[1]=1;state.market[1].price=3000;state.market[1].level=3;');
truth('view().action==="showEquilibria" && view().label==="균형 위치 확인하기 →"');
// Switching activities restores the last substep and safely accepts older records.
run('state=fresh();navigateScene(1);navigateSession(1);navigateScene(3);navigateSession(0);');
truth('currentScene()===1');run('navigateSession(1);');truth('currentScene()===3');
run('delete state.activityScenes;');truth('validState(state)');
run('navigateSession(0);');truth('validState(state)');
run('state.activityScenes=[0,0,0];');truth('!validState(state)');
console.log('PASS: completion actions, empty-state recovery, removed hint controls, survey drafts, real class size, equilibrium labels and remembered activity positions');


// Remote records update data without moving the current screen or discarding a draft.
run('state=fresh();state.scene[0]=1;var remote=fresh();remote.survey.values=[2,24,12,1,2];');
truth('syncStoredState(JSON.stringify(remote)) && currentScene()===1 && state.survey.values[4]===2');
run('state.scene[0]=0;surveyDrafts.set(2,"11");openSurvey(2);remote.survey.values[0]=3;');
truth('syncStoredState(JSON.stringify(remote)) && state.survey.row===2 && $("surveyDialog").open');
assert.equal(String(element('responseCount').value),'11');
truth('!syncStoredState("not-json") && state.survey.values[0]===3');
run('$("surveyDialog").close();state=fresh();state.scene[0]=2;state.supplyRows=[true,true,true,true,true];');
truth('view().action==="advanceScene" && view().label==="공급 점 찍기 →"');
console.log('PASS: multi-window record synchronization preserves navigation and unsaved survey drafts');


// Changing the class size keeps confirmed coordinates when all responses still fit.
run('state=fresh();state.survey.values=[20,16,12,8,4];state.dplot.points=[0,1];state.dplot.line=true;$("classSize").value="30";');
truth('updateSurveySize(false) && state.survey.size===30 && state.dplot.points.length===2 && state.dplot.line && validState(state)');
run('state.scene[0]=1;');truth('view().body.includes("수요량(개)") && !view().body.includes("수요량(개/하루)")');
console.log('PASS: class-size edits retain confirmed graph data and survey axes use the correct unit');


// A confirmed point travels along the price axis before moving to its quantity.
run('var motion={q:24,p:2000,maxQ:30};');
truth('pointMotionAt(motion,0).x===GEOM.l && pointMotionAt(motion,0).y===GEOM.b');
truth('pointMotionAt(motion,300).x===GEOM.l && pointMotionAt(motion,300).y<GEOM.b');
truth('pointMotionAt(motion,600).x===GEOM.l && pointMotionAt(motion,600).y===GEOM.b-(GEOM.b-GEOM.t)/3');
truth('pointMotionAt(motion,800).x===GEOM.l && pointMotionAt(motion,800).phase==="price"');
truth('pointMotionAt(motion,1200).x>GEOM.l && pointMotionAt(motion,1200).x<GEOM.r && pointMotionAt(motion,1200).y===pointMotionAt(motion,600).y');
truth('pointMotionAt(motion,1820).done && pointMotionAt(motion,1820).x===GEOM.l+(GEOM.r-GEOM.l)*24/30');
truth('pointMotionAt({q:0,p:5000,maxQ:60},1820).x===GEOM.l');
truth('pointMotionAt({q:20,p:5000,maxQ:28},1820).x===GEOM.l+(GEOM.r-GEOM.l)*20/28');
run('state=fresh();state.survey.values=[2,24,12,1,2];state.scene[0]=1;state.dplot.row=1;pendingPointMotion=null;state.dplot.candidate={q:12,p:2000};act("confirmPoint");');
truth('pendingPointMotion===null && state.dplot.points.length===0');
run('$("closePointErrorBtn").onclick();');
run('act("selectCoordinate");act("confirmPoint");');
truth('pendingPointMotion.q===24 && pendingPointMotion.p===2000 && state.dplot.points.includes(1) && validState(state)');
assert.ok(run("view().body").includes('id="pointMotion"'));
assert.ok(run("view().body").includes('id="pointMotionFinal" visibility="hidden"'));
console.log('PASS: price-first point animation, zero/supply coordinates and confirmed-data validation');


// Incorrect coordinates use a modal, keep the candidate, and return focus to the graph.
run('state=fresh();state.survey.values=[2,24,12,1,2];state.scene[0]=1;state.dplot.row=1;state.dplot.candidate={q:12,p:2000};pendingPointMotion=null;act("confirmPoint");');
truth('$("pointErrorDialog").open && state.dplot.points.length===0 && state.dplot.candidate.q===12 && pendingPointMotion===null');
assert.equal(element('pointErrorMessage').textContent,'선택한 위치는 2,000원·12개입니다. 표의 2,000원·24개와 비교해 다시 선택하세요.');
truth('view().feed===""');
run('$("closePointErrorBtn").onclick();$("pointErrorDialog").onclose();');
truth('!$("pointErrorDialog").open && $("plotSvg").focused');
run('act("selectCoordinate");act("confirmPoint");');
truth('!$("pointErrorDialog").open && state.dplot.points.includes(1) && pendingPointMotion.q===24 && validState(state)');
console.log('PASS: incorrect-point modal, no inline duplicate, candidate preservation, focus return and correct retry');

// The market carries the actual drawn vertices, not the old example demand.
run('state=fresh();state.session=1;');
truth(`lessonMarket()===null && view().action==="resumeDemand" && !view().body.includes('class="curve d"')`);
run('state.survey.values=[2,24,12,1,2];state.dplot={...freshPlot(),points:[4,1,0,3,2],line:true};');
truth('view().action==="resumeSupply"');
run('state.splot={...freshPlot(),points:[4,0,3,1,2],line:true};state.scene[1]=3;state.market[3].level=3;');
truth('lessonMarketAt(2000).qd===24 && lessonMarketAt(2000).qs===8 && lessonMarketAt(2500).qd===18');
truth('lessonEquilibria().length===2 && Math.abs(lessonEquilibria()[0].p-10000/9)<1e-7 && lessonEquilibria()[1].p===3000');
run('act("showEquilibria");');truth('$ ("marketResultContent").innerHTML.includes("1,111.1") && $("marketResultContent").innerHTML.includes("3,000") && view().feed==="" && !view().body.includes("별도인 예시 시장")');
const curvePath=body=>body.match(/<path class="curve d" d="([^"]+)"/)[1];
const vertices=(body,maxP)=>curvePath(body).match(/[ML][^ML]+/g).map(segment=>{const [x,y]=segment.slice(1).split(',').map(Number);return [(x-94)/610*30,(366-y)/320*maxP].map(n=>Math.round(n*1e6)/1e6);});
const marketVertices=vertices(run('view().body'),5500);
run('state.session=0;state.scene[0]=1;');assert.deepEqual(vertices(run('view().body'),6000),marketVertices);
truth('state.survey.values.join(",")==="2,24,12,1,2"');
// Exploration stays on 1,000-won prices; intermediate equilibria remain precise.
run('state.survey.values=[20,16,11,8,4];state.session=1;state.scene[1]=0;state.market[0].price=2000;state.market[0].level=3;');
truth('lessonMarketStep(2000)===2000 && view().action==="showEquilibria" && Math.abs(lessonEquilibria()[0].p-26000/9)<1e-7');
run('act("marketStep");');truth('state.market[0].price===2000 && validState(state)');
run('state.survey.values=[2,24,12,1,2];state.market[0].price=1000;');truth('view().action==="showEquilibria"');run('act("marketStep");');truth('state.market[0].price===1000 && validState(state)');
// No crossing, a shared segment, zero quantities and missing survey rows stay honest.
run('state.survey.values=[0,0,0,0,0];');truth(`lessonEquilibria().length===0 && view().body.includes('class="curve d"')`);
run('state.scene[1]=3;state.market[3].level=2;');run('act("showEquilibria");');truth('$("marketResultContent").innerHTML.includes("교차점이 없습니다")');
run('state.survey.values=SUPPLY.slice();');truth('lessonEquilibria().length===1 && lessonEquilibria()[0].p===1000 && lessonEquilibria()[0].endP===5000 && equilibriumText(lessonEquilibria()[0]).includes("균형 구간")');
run('state.survey.values=[20,null,8,null,null];state.dplot.points=[2,0];');
truth('lessonMarket().min===1000 && lessonMarket().max===3000 && lessonMarketAt(2000).qd===14 && lessonEquilibria().length===1 && Math.abs(lessonEquilibria()[0].p-2600)<1e-7');
truth('lessonMarketAt(5000).p===3000 && !view().body.includes("NaN")');
run('state.dplot.line=false;');truth('view().action==="resumeDemand" && validState(state)');
console.log('PASS: plotted curves continue into market, piecewise quantities, all intersections, missing data, shared segments, bounded fractional price steps and undo');

// A changed pair of curves starts a matching lesson; ordinary rerenders keep progress.
run('state=fresh();state.session=1;state.survey.values=[2,24,12,1,2];state.dplot={...freshPlot(),points:[0,1,2,3,4],line:true};state.splot={...freshPlot(),points:[0,1,2,3,4],line:true};prepareLessonMarket();');
truth('state.market[1].price===2000 && state.market[2].price===5000 && state.market[3].price===1000 && validState(state)');
run('state.market[1].level=2;prepareLessonMarket();');truth('state.market[1].level===2');
run('state.survey.values[2]=11;prepareLessonMarket();');truth('state.market[1].level===0 && validState(state)');
run('state.survey.size=60;state.survey.values=[60,50,40,30,20];prepareLessonMarket();');
truth('lessonEquilibria().length===1 && lessonEquilibria()[0].p===5000 && view().body.includes(">60</text>")');
run('state.market[0].price=Infinity;');truth('!validState(state)');
console.log('PASS: changed-curve initialization, matching shortage/surplus starting prices, unchanged-progress preservation and large-class axes');

// Selected design: reveal quantities, predict in a modal, inspect reaction, adjust, finish.
run('state=fresh();state.session=1;state.survey.values=[2,24,12,1,2];state.dplot={...freshPlot(),points:[0,1,2,3,4],line:true};state.splot={...freshPlot(),points:[0,1,2,3,4],line:true};prepareLessonMarket();state.scene[1]=1;');
truth('view().action==="predictMarket" && view().label==="가격 반응 예측하기 →" && view().feed==="" && view().body.includes("24개") && view().body.includes("8개")');
truth(`!view().body.includes("market-source") && !view().body.includes("market-price-bar") && view().body.includes('aria-orientation="vertical"')`);
run('act("predictMarket");');truth('$("marketPredictionDialog").open && $("marketPredictionPrice").textContent.includes("2,000")');
handlers.get('click')({target:{closest:selector=>selector==='[data-predict]'?{dataset:{predict:'market',value:'up'}}:null}});
truth('!$("marketPredictionDialog").open && currentMarket().prediction==="up" && currentMarket().level===2 && view().action==="marketOutcome"');
run('act("marketOutcome");');truth('$("marketResultDialog").open && $("marketResultTitle").textContent==="초과 수요" && $("marketResultContent").innerHTML.includes("16개") && view().feed==="" && view().action==="marketStep"');
run('act("marketStep");');truth('!$("marketResultDialog").open && currentMarket().price===3000 && currentMarket().level===1 && currentMarket().prediction===null');
run('undo();');truth('currentMarket().price===2000 && currentMarket().level===3');
run('act("showEquilibria");');truth('currentMarket().compared && view().action==="finishMarket" && $("marketResultContent").innerHTML.includes("1,111.1") && $("marketResultContent").innerHTML.includes("3,000")');
run('act("closeMarketResult");$("marketResultDialog").onclose();');assert.equal(element('actionBtn').focused,true);
run('undo();');truth('!currentMarket().compared && currentMarket().level===3');
run('act("finishMarket");');truth('$("endDialog").open && currentScene()===1');
run('currentMarket().price=10000/9;previewMarketPrice(1500);finishMarketPriceDrag();');truth('currentMarket().price===2000');
run('previewMarketPrice(1000);finishMarketPriceDrag();');truth('currentMarket().price===1000 && validState(state)');
console.log('PASS: selected market layout workflow, prediction modal, reaction result, step/undo, equilibrium reveal, finish and fractional-price controls');

// A native slider previews in place and records one undo entry per whole gesture.
run('state=fresh();state.session=1;state.survey.values=[2,24,12,1,2];state.dplot={...freshPlot(),points:[0,1,2,3,4],line:true};state.splot={...freshPlot(),points:[0,1,2,3,4],line:true};prepareLessonMarket();state.scene[1]=1;currentMarket().level=2;currentMarket().prediction="up";');
const sliderInput=value=>handlers.get('input')({target:{id:'marketPriceSlider',value}});
sliderInput('2100');sliderInput('3000');sliderInput('4000');
truth('currentMarket().price===4000 && currentMarket().history.length===1 && currentMarket().level===1 && currentMarket().prediction===null');
assert.equal(element('marketDemandValue').textContent,'1개');assert.equal(element('marketSupplyValue').textContent,'16개');assert.equal(element('marketPriceValue').textContent,'4,000원');
assert.equal(element('marketPriceSlider').attributes['aria-valuetext'],'4,000원');
handlers.get('change')({target:{id:'marketPriceSlider'}});truth('marketPriceDraft===null && currentMarket().history.length===1 && validState(state)');
run('undo();');truth('currentMarket().price===2000 && currentMarket().level===2 && currentMarket().prediction==="up" && currentMarket().history.length===0');
// Returning to the original price preserves the prior prediction and creates no undo step.
sliderInput('4000');sliderInput('2000');handlers.get('focusout')({target:{id:'marketPriceSlider'}});
truth('marketPriceDraft===null && currentMarket().history.length===0 && currentMarket().level===2 && currentMarket().prediction==="up"');
for(const value of ['', 'NaN', 'Infinity', '999', '5001'])sliderInput(value);
truth('currentMarket().price===2000 && marketPriceDraft===null');
sliderInput(String(10000/9));handlers.get('pointercancel')({target:{id:'marketPriceSlider'}});
truth('marketPriceDraft===null && currentMarket().price===1000 && validState(state)');
run('currentMarket().history=Array.from({length:199},()=>({price:1000,level:1}));previewMarketPrice(5000);finishMarketPriceDrag();');
truth('currentMarket().history.length===199 && currentMarket().price===5000 && validState(state)');
console.log('PASS: native vertical slider live readouts, gesture-level undo, prediction restoration, no-op gestures, validation and bounded history');

// Imported or previously dragged fractional prices snap before the control is rendered.
run('currentMarket().price=2227.9;currentMarket().prediction="up";currentMarket().level=2;prepareLessonMarket();');
truth(`currentMarket().price===2000 && currentMarket().prediction===null && currentMarket().level===1 && view().body.includes('step="1000"')`);
for(const [raw,want] of [[1000,1000],[1499,1000],[1500,2000],[2227.9,2000],[2999,3000],[4501,5000]])assert.equal(run(`marketControlPrice(${raw})`),want);
console.log('PASS: 1,000-won slider steps, fractional-price migration and precise off-grid equilibrium results without price oscillation');

// Coarse exploration must never round the mathematical intersections.
run('state=fresh();state.session=1;state.survey.values=[2,15,11,1,2];state.dplot={...freshPlot(),points:[0,1,2,3,4],line:true};state.splot={...freshPlot(),points:[0,1,2,3,4],line:true};prepareLessonMarket();state.scene[1]=0;currentMarket().price=2000;currentMarket().level=3;');
truth('lessonEquilibria().length===2 && Math.abs(lessonEquilibria()[0].p-11000/9)<1e-7 && lessonEquilibria()[1].p===2875');
truth('lessonMarketStep(2000)===2000 && view().action==="showEquilibria"');
run('act("showEquilibria");');truth('$("marketResultContent").innerHTML.includes("2,875") && $("marketResultContent").innerHTML.includes("11.5") && $("marketResultContent").innerHTML.includes("1,222.2")');
run('currentMarket().compared=false;currentMarket().level=1;currentMarket().history=[{price:2227.9,level:2,prediction:"up",compared:false}];undo();');
truth('currentMarket().price===2000 && currentMarket().level===1 && currentMarket().prediction===null && validState(state)');
console.log('PASS: coarse price selection preserves both off-grid intersections and rejects stale predictions when restoring old fractional history');
