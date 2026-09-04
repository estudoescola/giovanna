const scenes = [...document.querySelectorAll('.scene')];
const navItems = [...document.querySelectorAll('.nav-item')];
const chapterCount = document.querySelector('#chapterCount');
const chapterNav = document.querySelector('#chapterNav');
const cycleContent = {
  stress: ['01', 'Hoje foi difícil.', 'O estresse não é fraqueza. É o ponto onde a busca por alívio costuma começar.'],
  urge: ['02', 'Eu só preciso desligar.', 'A vontade aparece como uma promessa: rápida, conhecida e cada vez mais automática.'],
  alcohol: ['03', 'Por alguns minutos, funciona.', 'O álcool pode produzir alívio momentâneo. Alívio não é o mesmo que resolver.'],
  relief: ['04', 'O silêncio chega.', 'O cérebro aprende a repetir aquilo que parece aliviar. É assim que um hábito pode ganhar força.'],
  cost: ['05', 'Mas o problema continua.', 'Quando o efeito passa, as consequências podem alimentar o mesmo estresse que iniciou o ciclo.']
};
const brainContent = {
  reward: ['O alívio fica marcado', 'O álcool pode afetar circuitos de recompensa e fazer o cérebro associar o consumo a uma sensação rápida de alívio.'],
  tolerance: ['O efeito muda', 'Com o tempo, algumas pessoas precisam consumir mais para obter efeitos semelhantes. Isso é tolerância.'],
  control: ['Decidir fica mais difícil', 'Alterações no julgamento e no controle dos impulsos podem tornar escolhas difíceis ainda mais difíceis.'],
  withdrawal: ['Parar pode doer', 'Em pessoas dependentes, reduzir ou interromper o consumo pode trazer sintomas de abstinência. Procure orientação profissional.']
};
const impactContent = { corpo: 'Sono, fígado, coração e sistema nervoso podem sentir os efeitos do consumo.', mente: 'Ansiedade, humor, memória e tomada de decisões podem mudar.', relacoes: 'Família, amizades e a sensação de pertencimento também podem ser afetadas.', vida: 'Estudos, trabalho, finanças, segurança e planos podem perder espaço.' };
const quizData = [
  ['Se eu só bebo aos finais de semana, não posso ter um problema.', 'myth', 'O padrão e as consequências importam mais do que o dia da semana.'],
  ['Alcoolismo é apenas falta de força de vontade.', 'myth', 'Dependência envolve fatores biológicos, psicológicos e sociais.'],
  ['Uma pessoa pode precisar de ajuda mesmo querendo parar.', 'truth', 'Querer parar é importante. Precisar de suporte não diminui essa vontade.'],
  ['Uma frase isolada diagnostica dependência.', 'myth', 'Nenhuma frase sozinha faz diagnóstico. Uma conversa cuidadosa pode abrir caminho para ajuda.']
];
let quizIndex = 0;
let visited = [];

try {
  const storedVisited = JSON.parse(localStorage.getItem('eraCopoVisited') || '[]');
  visited = Array.isArray(storedVisited) ? storedVisited : [];
} catch {
  localStorage.removeItem('eraCopoVisited');
}

function showScene(id) {
  const scene = document.getElementById(id);
  if (!scene) return;
  history.replaceState(null, '', `#${id}`);
  scenes.forEach(item => item.classList.toggle('active', item === scene));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.target === id));
  chapterCount.textContent = `${String(scene.dataset.chapter).padStart(2, '0')} / 10`;
  visited = [...new Set([...visited, id])];
  localStorage.setItem('eraCopoVisited', JSON.stringify(visited));
  chapterNav.classList.remove('open');
  document.querySelector('#menuToggle').setAttribute('aria-expanded', 'false');
  scene.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'first') setTimeout(() => { document.querySelector('#introWine').style.height = '55%'; document.querySelector('#glassCaption').textContent = 'um primeiro gesto'; }, 250);
  if (id === 'impact') { document.querySelector('#spaceFill').style.width = '72%'; document.querySelector('#spaceValue').textContent = '72%'; }
  if (id === 'recovery') animateCounter();
}

function showSceneFromHash() {
  const target = window.location.hash.slice(1);
  if (target && document.getElementById(target)?.classList.contains('scene')) showScene(target);
}

function fillIntroGlass() {
  const wine = document.querySelector('#introWine');
  const caption = document.querySelector('#glassCaption');
  if (wine.style.height === '55%') return;
  wine.style.height = '55%';
  caption.textContent = 'um primeiro gesto';
}

const glassStage = document.querySelector('#glassStage');
glassStage.addEventListener('click', fillIntroGlass);
glassStage.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fillIntroGlass();
  }
});

document.querySelector('.brand').addEventListener('click', event => {
  event.preventDefault();
  showScene('intro');
});

function addFirstExperience() {
  const section = document.querySelector('#first .section-inner');
  const continueButton = section.querySelector('.next-button');
  const panel = document.createElement('div');
  panel.className = 'first-experience';
  panel.innerHTML = '<p class="panel-label">UMA SITUAÇÃO COTIDIANA</p><p>Uma festa. Amigos. Música. Alguém oferece um copo.</p><strong>Você aceita?</strong><div class="first-options"><button type="button" data-first-choice="yes">SIM</button><button type="button" data-first-choice="no">NÃO</button></div><p class="first-result" aria-live="polite"></p>';
  section.insertBefore(panel, continueButton);
  continueButton.disabled = true;
  panel.querySelectorAll('[data-first-choice]').forEach(button => button.addEventListener('click', () => {
    panel.querySelectorAll('[data-first-choice]').forEach(option => option.classList.toggle('selected', option === button));
    panel.querySelector('.first-result').textContent = button.dataset.firstChoice === 'yes'
      ? 'Você aceitou. Uma primeira experiência pode ser social, curiosa ou simplesmente circunstancial.'
      : 'Você recusou. Não aceitar também é uma escolha válida, e cada pessoa tem seu próprio contexto.';
    continueButton.disabled = false;
  }));
}

function addRoutineTimeline() {
  const section = document.querySelector('#cycle .section-inner');
  const timeline = document.createElement('div');
  timeline.className = 'routine-timeline';
  timeline.innerHTML = '<p class="panel-label">COMO UMA JUSTIFICATIVA PODE MUDAR</p><button class="timeline-step active" type="button"><b>SEXTA-FEIRA</b><span>Festa e amigos</span></button><button class="timeline-step" type="button"><b>ALGUMAS SEMANAS DEPOIS</b><span>“Só no fim de semana.”</span></button><button class="timeline-step" type="button"><b>DEPOIS</b><span>“Foi uma semana difícil.”</span></button><button class="timeline-step" type="button"><b>MAIS TARDE</b><span>“Eu mereço.”</span></button>';
  section.insertBefore(timeline, section.querySelector('.cycle-layout'));
  timeline.querySelectorAll('.timeline-step').forEach((step, index, steps) => step.addEventListener('click', () => {
    steps.forEach(item => item.classList.remove('active'));
    step.classList.add('active');
  }));
}

function addRecoveryJourney() {
  const section = document.querySelector('#recovery .section-inner');
  const journey = document.createElement('div');
  journey.className = 'recovery-journey';
  journey.innerHTML = '<p class="panel-label">UM CAMINHO POSSÍVEL</p><div class="journey-track"><button class="journey-step active" type="button">RECONHECER</button><button class="journey-step" type="button">BUSCAR INFORMAÇÃO</button><button class="journey-step" type="button">CONVERSAR</button><button class="journey-step" type="button">PROCURAR AJUDA</button><button class="journey-step" type="button">TRATAMENTO</button><button class="journey-step" type="button">RECUPERAÇÃO</button></div><p class="journey-detail" aria-live="polite">Perceber mudanças pode ser o primeiro passo. Pedir ajuda não é fracasso; é uma decisão.</p>';
  section.insertBefore(journey, section.querySelector('.data-counter'));
  const details = ['Perceber mudanças pode ser o primeiro passo. Pedir ajuda não é fracasso; é uma decisão.', 'Informação ajuda a trocar culpa por compreensão e a encontrar caminhos possíveis.', 'Uma conversa segura pode começar com alguém de confiança.', 'Profissionais e serviços de saúde podem avaliar o contexto e orientar o cuidado.', 'O tratamento é individualizado e pode combinar diferentes formas de suporte.', 'Recuperação não é uma linha reta. Apoio contínuo também faz parte do caminho.'];
  journey.querySelectorAll('.journey-step').forEach((step, index, steps) => step.addEventListener('click', () => {
    steps.forEach(item => item.classList.remove('active'));
    step.classList.add('active');
    journey.querySelector('.journey-detail').textContent = details[index];
  }));
}

addFirstExperience();
addRoutineTimeline();
addRecoveryJourney();

document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => showScene(button.dataset.next)));
navItems.forEach(item => item.addEventListener('click', () => showScene(item.dataset.target)));
window.addEventListener('hashchange', showSceneFromHash);
showSceneFromHash();
document.querySelector('#menuToggle').addEventListener('click', event => { const open = chapterNav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', open); });

document.querySelectorAll('.cycle-node').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.cycle-node').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  const [number, title, text] = cycleContent[button.dataset.cycle];
  document.querySelector('.message-number').textContent = number;
  document.querySelector('.cycle-message h3').textContent = title;
  document.querySelector('.cycle-message p').textContent = text;
}));

document.querySelectorAll('.brain-tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.brain-tab').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('.brain-tab').forEach(item => item.setAttribute('aria-selected', String(item === button)));
  const [title, text] = brainContent[button.dataset.brain];
  document.querySelector('#brainMessage h3').textContent = title;
  document.querySelector('#brainMessage p').textContent = text;
}));

document.querySelectorAll('.choice-card').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.choice-card').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  const messages = { talk: 'Você procurou presença. Uma escolha também pode ser pedir para não atravessar a noite sozinho.', walk: 'Você mudou o ritmo. Nem todo alívio precisa vir em um copo.', drink: 'Você escolheu beber. Na próxima semana, o dia difícil voltou. E a espera pelo fim do dia começou mais cedo.' };
  document.querySelector('#choiceResult').textContent = messages[button.dataset.choice];
  const path = { talk: [55, 20, 90, 18], walk: [45, 28, 70, 24], drink: [82, 70, 25, 68] }[button.dataset.choice];
  ['stress', 'isolation', 'support', 'risk'].forEach((name, index) => { document.querySelector(`[data-path="${name}"]`).style.width = `${path[index]}%`; });
  document.querySelector('#choiceContinue').classList.remove('hidden');
}));

document.querySelectorAll('.impact-orbit').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.impact-orbit').forEach(item => item.classList.remove('active')); button.classList.add('active'); document.querySelector('#impactDetail').textContent = impactContent[button.dataset.impact]; }));

document.querySelector('.scene-mirror .text-button').addEventListener('click', event => { const lines = document.querySelectorAll('.mirror-line'); const current = [...lines].findIndex(line => line.classList.contains('active')); if (current < lines.length - 1) { lines[current].classList.remove('active'); lines[current + 1].classList.add('active'); event.currentTarget.textContent = 'CONTINUAR  →'; } else showScene('quiz'); });
document.querySelector('#mirrorSlider').addEventListener('input', event => { const value = Number(event.currentTarget.value); document.querySelector('#outsideInside').style.opacity = `${0.55 + Math.abs(value - 50) / 110}`; document.querySelector('#outsideInside').style.transform = `translateX(${(value - 50) / 12}px)`; });
const quizNext = document.createElement('button');
quizNext.className = 'text-button hidden';
quizNext.type = 'button';
quizNext.innerHTML = 'PRÓXIMA FRASE <span>→</span>';
document.querySelector('#quizCard').append(quizNext);

function renderQuiz() {
  document.querySelector('#quizNumber').textContent = String(quizIndex + 1).padStart(2, '0');
  document.querySelector('#quizBar').style.width = `${((quizIndex + 1) / quizData.length) * 100}%`;
  document.querySelector('#quizQuestion').textContent = `“${quizData[quizIndex][0]}”`;
  document.querySelector('#quizFeedback').textContent = '';
  document.querySelector('#quizContinue').classList.add('hidden');
  quizNext.classList.add('hidden');
  document.querySelectorAll('.quiz-options button').forEach(button => { button.disabled = false; button.classList.remove('selected'); });
}
renderQuiz();
document.querySelectorAll('.quiz-options button').forEach(button => button.addEventListener('click', () => {
  const correct = button.dataset.answer === quizData[quizIndex][1];
  document.querySelectorAll('.quiz-options button').forEach(option => { option.disabled = true; option.classList.toggle('selected', option === button); });
  document.querySelector('#quizFeedback').textContent = `${correct ? 'ACERTOU. ' : 'OLHE DE NOVO. '}${quizData[quizIndex][2]}`;
  if (quizIndex < quizData.length - 1) quizNext.classList.remove('hidden');
  else document.querySelector('#quizContinue').classList.remove('hidden');
}));
quizNext.addEventListener('click', () => { quizIndex += 1; renderQuiz(); });

const factorExplanations = { estresse: 'Pressões acumuladas podem aumentar a busca por alívio, mas não determinam o caminho de ninguém.', pressao: 'Ambientes e expectativas sociais podem influenciar escolhas de consumo.', isolamento: 'Menos apoio pode tornar mais difícil perceber mudanças ou pedir ajuda.', apoio: 'Relações de confiança podem facilitar conversa, cuidado e recuperação.' };
document.querySelectorAll('.factor-grid button').forEach(button => button.addEventListener('click', () => { document.querySelector('#factorDetail').textContent = factorExplanations[button.dataset.factor]; }));
function animateCounter() { const counter = document.querySelector('[data-counter]'); if (counter.dataset.done) return; const target = Number(counter.dataset.counter); let current = 0; const tick = () => { current += Math.ceil(target / 24); counter.textContent = Math.min(current, target); if (current < target) requestAnimationFrame(tick); else counter.dataset.done = 'true'; }; requestAnimationFrame(tick); }

document.querySelector('#themeToggle').addEventListener('click', () => document.body.classList.toggle('light'));
document.querySelector('#soundToggle').addEventListener('click', event => { const on = event.currentTarget.dataset.on !== 'true'; event.currentTarget.dataset.on = on; event.currentTarget.textContent = on ? '◉' : '◌'; event.currentTarget.title = on ? 'Som ambiente ativado' : 'Som ambiente desligado'; });
document.querySelector('#restartButton').addEventListener('click', () => { localStorage.removeItem('eraCopoVisited'); quizIndex = 0; renderQuiz(); document.querySelector('#introWine').style.height = '0'; document.querySelector('#glassCaption').textContent = 'clique para encher'; document.querySelectorAll('.mirror-line').forEach((line, index) => line.classList.toggle('active', index === 0)); showScene('intro'); });
