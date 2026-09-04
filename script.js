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
  ['Se uma pessoa trabalha, estuda e mantém sua rotina, ela não pode ter um problema relacionado ao álcool.', 'myth', 'Uma pessoa pode manter algumas áreas funcionando e, ainda assim, apresentar problemas relacionados ao álcool.'],
  ['Precisar de quantidades maiores de álcool para sentir o mesmo efeito pode ser um sinal de tolerância.', 'fact', 'A tolerância pode acontecer quando o organismo se adapta ao álcool.'],
  ['Uma pessoa com dependência só precisa ter mais força de vontade para parar.', 'myth', 'A dependência é complexa e pode envolver fatores biológicos, psicológicos e sociais.'],
  ['Interromper o consumo depois de um período de uso intenso pode causar sintomas de abstinência.', 'fact', 'Algumas pessoas podem apresentar sintomas físicos e psicológicos; uma avaliação profissional é importante.'],
  ['O estresse pode influenciar a vontade de consumir álcool, mas não determina que alguém desenvolverá dependência.', 'fact', 'O desenvolvimento de problemas relacionados ao álcool é influenciado por diferentes fatores.'],
  ['Beber apenas nos finais de semana significa que não existe risco de problemas relacionados ao álcool.', 'myth', 'Frequência não é o único aspecto relevante: quantidade, padrão e consequências também importam.'],
  ['Uma recaída significa que a recuperação fracassou completamente.', 'myth', 'A recuperação pode envolver avanços e dificuldades; o plano de cuidado pode ser reavaliado.'],
  ['Conversar com alguém de confiança pode ser um primeiro passo para procurar ajuda.', 'fact', 'Uma pessoa de confiança pode diminuir o isolamento e facilitar a busca por cuidado.'],
  ['É possível perceber a existência de dependência apenas olhando para uma pessoa.', 'myth', 'Não existe uma aparência única; uma avaliação considera diferentes aspectos da vida e do consumo.'],
  ['Procurar um profissional de saúde não significa necessariamente que a pessoa será internada.', 'fact', 'Buscar ajuda permite conversar sobre a situação e conhecer possibilidades de cuidado.']
];
let quizIndex = 0;
let quizCorrect = 0;
let visited = [];
const chapterNames = ['O copo', 'O ciclo', 'O cérebro', 'A escolha', 'O impacto', 'O espelho', 'Mitos', 'Saída', 'Ajuda', 'Última pergunta'];
const chapterTargets = ['intro', 'cycle', 'brain', 'choice', 'impact', 'mirror', 'quiz', 'recovery', 'help', 'final'];
const chapterIcons = ['◒', '↻', '✦', '◇', '◉', '◐', '?', '↗', '♡', '○'];
const discoveryNames = {
  first: 'Primeiro passo', cycle: 'Entendi o ciclo', brain: 'Explorei o cérebro', choice: 'Fiz uma escolha', impact: 'Observei os impactos', mirror: 'Olhei por dentro', quiz: 'Separei mito de realidade', recovery: 'Encontrei caminhos de ajuda', portal: 'Atravessei o copo', crisis: 'Reconheci sinais de emergência'
};
let discoveries = [];
let experienceStats = { knowledge: 0, support: 20, stress: 35 };

try {
  const storedVisited = JSON.parse(localStorage.getItem('eraCopoVisited') || '[]');
  visited = Array.isArray(storedVisited) ? storedVisited : [];
} catch {
  localStorage.removeItem('eraCopoVisited');
}

try {
  discoveries = JSON.parse(localStorage.getItem('eraCopoDiscoveries') || '[]');
  experienceStats = { ...experienceStats, ...JSON.parse(localStorage.getItem('eraCopoStats') || '{}') };
  if (!Array.isArray(discoveries)) discoveries = [];
} catch {
  localStorage.removeItem('eraCopoDiscoveries');
  localStorage.removeItem('eraCopoStats');
}

const experienceHud = document.createElement('aside');
experienceHud.className = 'experience-hud';
experienceHud.setAttribute('aria-label', 'Resumo da sua experiência');
experienceHud.innerHTML = '<button class="hud-toggle" type="button" aria-expanded="false">◈ <span>EXPERIÊNCIA</span></button><div class="hud-content"><p class="hud-title">SUA EXPERIÊNCIA <small>metáfora narrativa, não diagnóstico</small></p><div class="hud-stats"><span><b id="knowledgeValue">0%</b> conhecimento</span><span><b id="supportValue">20%</b> apoio</span><span><b id="stressValue">35%</b> estresse</span></div><p class="hud-discoveries"><b id="discoveryValue">0/8</b> descobertas</p></div>';
document.body.append(experienceHud);
experienceHud.querySelector('.hud-toggle').addEventListener('click', event => {
  const open = experienceHud.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

const journeyMap = document.createElement('div');
journeyMap.className = 'journey-map';
journeyMap.innerHTML = `<p class="panel-label">SUA JORNADA <span>capítulos visitados ficam coloridos</span></p><div>${chapterNames.map((name, index) => `<button type="button" data-map-target="${chapterTargets[index]}"><i>${chapterIcons[index]}</i><span>${String(index + 1).padStart(2, '0')} ${name}</span></button>`).join('')}</div>`;
chapterNav.prepend(journeyMap);
journeyMap.querySelectorAll('[data-map-target]').forEach(button => button.addEventListener('click', () => showScene(button.dataset.mapTarget)));

navItems.forEach((item, index) => {
  item.innerHTML = `<span class="nav-icon">${chapterIcons[index]}</span>${item.innerHTML}`;
});

document.querySelectorAll('.cycle-node').forEach(button => { button.setAttribute('aria-pressed', String(button.classList.contains('active'))); });
document.querySelectorAll('.brain-tab').forEach(button => { button.setAttribute('aria-selected', String(button.classList.contains('active'))); });

const discoveryToast = document.createElement('div');
discoveryToast.className = 'discovery-toast';
discoveryToast.setAttribute('role', 'status');
document.body.append(discoveryToast);

const guide = document.createElement('div');
guide.className = 'guide-character';
guide.innerHTML = '<div class="guide-avatar"><span class="guide-head"></span><span class="guide-body"></span></div><p class="guide-message">Toque no copo.</p>';
document.body.append(guide);
const guideMessage = guide.querySelector('.guide-message');
const guideMessages = { intro: 'Você percebeu?', first: 'E se acontecesse com você?', cycle: 'Por que isso parece resolver?', brain: 'O que ficou mais difícil?', choice: 'Você escolheria igual se ninguém visse?', impact: 'O que mais esse copo alcança?', mirror: 'O que existe por dentro?', quiz: 'Será que essa frase é verdade?', recovery: 'Qual pode ser o próximo passo?', help: 'O que você faria agora?', final: 'O que veio antes do copo?' };

function updateExperienceUI() {
  document.querySelector('#knowledgeValue').textContent = `${experienceStats.knowledge}%`;
  document.querySelector('#supportValue').textContent = `${experienceStats.support}%`;
  document.querySelector('#stressValue').textContent = `${experienceStats.stress}%`;
  document.querySelector('#discoveryValue').textContent = `${discoveries.length}/10`;
  journeyMap.querySelectorAll('[data-map-target]').forEach(button => {
    const target = document.getElementById(button.dataset.mapTarget);
    button.classList.toggle('visited', target.classList.contains('active') || visited.includes(target.id));
  });
}

function unlockDiscovery(id) {
  if (!discoveryNames[id] || discoveries.includes(id)) return;
  discoveries.push(id);
  experienceStats.knowledge = Math.min(100, discoveries.length * 12);
  localStorage.setItem('eraCopoDiscoveries', JSON.stringify(discoveries));
  localStorage.setItem('eraCopoStats', JSON.stringify(experienceStats));
  discoveryToast.textContent = `DESCOBERTA: ${discoveryNames[id]}`;
  discoveryToast.classList.add('show');
  setTimeout(() => discoveryToast.classList.remove('show'), 2600);
  updateExperienceUI();
}

function addCuriosityReveal(selector, question, answer) {
  const section = document.querySelector(selector);
  if (!section) return;
  const reveal = document.createElement('div');
  reveal.className = 'curiosity-reveal';
  reveal.innerHTML = `<strong>${question}</strong><button type="button">DESCUBRIR <span>→</span></button><p hidden>${answer}</p>`;
  section.querySelector('.section-inner').prepend(reveal);
  reveal.querySelector('button').addEventListener('click', event => {
    reveal.querySelector('p').hidden = false;
    event.currentTarget.hidden = true;
    reveal.classList.add('revealed');
  });
}

const mobileNavigation = document.createElement('div');
mobileNavigation.className = 'mobile-navigation';
mobileNavigation.innerHTML = '<button class="mobile-back" type="button" aria-label="Voltar ao capítulo anterior">← <span>VOLTAR</span></button><div class="mobile-progress" aria-label="Progresso da experiência"><i></i></div>';
document.querySelector('.topbar').append(mobileNavigation);
const mobileBack = mobileNavigation.querySelector('.mobile-back');
const mobileProgress = mobileNavigation.querySelector('.mobile-progress i');

function showScene(id) {
  const scene = document.getElementById(id);
  if (!scene) return;
  history.replaceState(null, '', `#${id}`);
  scenes.forEach(item => item.classList.toggle('active', item === scene));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.target === id));
  chapterCount.textContent = `${String(scene.dataset.chapter).padStart(2, '0')} / 10`;
  mobileProgress.style.width = `${(Number(scene.dataset.chapter) / 10) * 100}%`;
  const sceneIndex = scenes.indexOf(scene);
  mobileBack.disabled = sceneIndex <= 0;
  visited = [...new Set([...visited, id])];
  localStorage.setItem('eraCopoVisited', JSON.stringify(visited));
  document.body.dataset.chapter = scene.dataset.chapter;
  guideMessage.textContent = guideMessages[id] || 'Continue explorando.';
  updateExperienceUI();
  if (id === 'first') unlockDiscovery('first');
  if (id === 'cycle') unlockDiscovery('cycle');
  chapterNav.classList.remove('open');
  document.querySelector('#menuToggle').setAttribute('aria-expanded', 'false');
  scene.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'first') setTimeout(() => { document.querySelector('#introWine').style.height = '55%'; document.querySelector('#glassCaption').textContent = 'um primeiro gesto'; }, 250);
  if (id === 'impact') { document.querySelector('#spaceFill').style.width = '72%'; document.querySelector('#spaceValue').textContent = '72%'; }
  if (id === 'recovery') animateCounter();
}

mobileBack.addEventListener('click', () => {
  const current = scenes.findIndex(scene => scene.classList.contains('active'));
  if (current > 0) showScene(scenes[current - 1].id);
});

function showSceneFromHash() {
  const target = window.location.hash.slice(1);
  if (target && document.getElementById(target)?.classList.contains('scene')) showScene(target);
}

let glassTouches = 0;
const maxGlassTouches = 5;

function createGlassParticles() {
  const stage = document.querySelector('#glassStage');
  for (let index = 0; index < 12; index += 1) {
    const particle = document.createElement('i');
    particle.className = 'glass-particle';
    particle.style.setProperty('--x', `${Math.random() * 130 - 65}px`);
    particle.style.setProperty('--y', `${Math.random() * -120 - 20}px`);
    particle.style.setProperty('--delay', `${Math.random() * .4}s`);
    stage.append(particle);
  }
}

function triggerGlassTouch() {
  const wine = document.querySelector('#introWine');
  const caption = document.querySelector('#glassCaption');
  if (glassTouches >= maxGlassTouches) return;
  glassTouches += 1;
    caption.textContent = `${[`Ele reagiu.`, `O líquido começa a subir.`, `Você percebeu as partículas.`, `O cenário está mudando.`, `O copo virou uma passagem.`][glassTouches - 1]} toque ${glassTouches} de ${maxGlassTouches}`;
  glassStage.classList.add(`touch-${glassTouches}`);
  glassStage.classList.remove('glass-shake');
  void glassStage.offsetWidth;
  glassStage.classList.add('glass-shake');
  if (glassTouches === 2) wine.style.height = '55%';
  if (glassTouches === 3) createGlassParticles();
  if (glassTouches === 4) guideMessage.textContent = 'Você percebeu algo.';
  if (glassTouches === 5) {
    glassStage.classList.add('portal-active');
    unlockDiscovery('portal');
    setTimeout(() => showScene('first'), 900);
  }
  if (navigator.vibrate) navigator.vibrate(glassTouches === 5 ? [35, 25, 70] : 18);
}

const glassStage = document.querySelector('#glassStage');
glassStage.addEventListener('click', triggerGlassTouch);
glassStage.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    triggerGlassTouch();
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
    panel.querySelectorAll('[data-first-choice]').forEach(button => button.addEventListener('click', (event) => {
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
    if (index > 0) unlockDiscovery('cycle');
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
    if (index === steps.length - 1) unlockDiscovery('recovery');
  }));
}

function addBrainLaboratory() {
  const art = document.querySelector('.brain-art');
  const progress = document.createElement('p');
  const hotspots = document.createElement('div');
  const found = new Set();
  progress.className = 'brain-progress';
  progress.textContent = '0/4 pontos explorados';
  hotspots.className = 'brain-hotspots';
  hotspots.innerHTML = '<button type="button" data-brain-point="reward" aria-label="Explorar recompensa">+</button><button type="button" data-brain-point="tolerance" aria-label="Explorar tolerância">+</button><button type="button" data-brain-point="control" aria-label="Explorar controle">+</button><button type="button" data-brain-point="withdrawal" aria-label="Explorar abstinência">+</button>';
  art.append(hotspots, progress);
  hotspots.querySelectorAll('button').forEach(point => point.addEventListener('click', () => {
    found.add(point.dataset.brainPoint);
    point.classList.add('found');
    point.textContent = '✓';
    progress.textContent = `${found.size}/4 pontos explorados`;
    document.querySelector(`[data-brain="${point.dataset.brainPoint}"]`).click();
    if (found.size === 4) {
      document.querySelector('#brainMessage h3').textContent = 'CÉREBRO EXPLORADO';
      document.querySelector('#brainMessage p').textContent = 'Você encontrou as quatro dimensões desta etapa. O cérebro aprende associações, mas cada história e cada recuperação são únicas.';
      unlockDiscovery('brain');
    }
  }));
}

function addAttentionChallenge() {
  const info = document.querySelector('#brain .brain-info');
  const challenge = document.createElement('div');
  challenge.className = 'attention-challenge';
  challenge.innerHTML = '<p class="panel-label">DESAFIO DE ATENÇÃO <span>encontre o símbolo pedido</span></p><p class="attention-prompt">Toque em <strong>✦</strong> antes que o tempo acabe.</p><div class="attention-timer" aria-live="polite">5s</div><div class="attention-grid"></div><p class="attention-result" aria-live="polite"></p><button class="text-button attention-start" type="button">COMEÇAR DESAFIO <span>→</span></button>';
  info.append(challenge);
  const grid = challenge.querySelector('.attention-grid');
  const result = challenge.querySelector('.attention-result');
  const timer = challenge.querySelector('.attention-timer');
  const symbols = ['●', '◆', '○', '▲', '✦', '□', '◇', '△', '■'];
  let interval;
  let running = false;
  function start() {
    clearInterval(interval);
    running = true;
    let remaining = 5;
    timer.textContent = `${remaining}s`;
    result.textContent = '';
    grid.innerHTML = [...symbols].sort(() => Math.random() - .5).map(symbol => `<button type="button" data-symbol="${symbol}">${symbol}</button>`).join('');
    challenge.querySelector('.attention-start').classList.add('hidden');
    interval = setInterval(() => {
      remaining -= 1;
      timer.textContent = `${remaining}s`;
      if (remaining <= 0) {
        clearInterval(interval);
        running = false;
        result.textContent = 'O tempo acabou. Tente novamente, sem pressa.';
        challenge.querySelector('.attention-start').classList.remove('hidden');
      }
    }, 1000);
    grid.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      if (!running) return;
      if (button.dataset.symbol === '✦') {
        clearInterval(interval);
        running = false;
        button.classList.add('found');
        result.textContent = 'ENCONTRADO. Atenção e coordenação podem ficar mais difíceis sob efeito do álcool.';
        challenge.querySelector('.attention-start').classList.remove('hidden');
        unlockDiscovery('brain');
      } else {
        button.classList.add('wrong');
      }
    }));
  }
  challenge.querySelector('.attention-start').addEventListener('click', start);
}

function addTimedDecision() {
  const section = document.querySelector('#choice .section-inner');
  const challenge = document.createElement('div');
  challenge.className = 'timed-decision';
  challenge.innerHTML = '<p class="panel-label">DECISÃO SOB PRESSÃO <span>tempo narrativo, não teste</span></p><h3>Seu amigo quer voltar para casa. Quem vai dirigir bebeu.</h3><div class="decision-timer" aria-live="polite">3.0s</div><div class="decision-options"><button type="button" data-decision="stay">Fico com meu amigo e procuro outra carona</button><button type="button" data-decision="drive">Deixo ele dirigir mesmo assim</button><button type="button" data-decision="call">Peço ajuda a um adulto ou serviço</button></div><p class="decision-result" aria-live="polite"></p><button class="text-button decision-start" type="button">INICIAR SITUAÇÃO <span>→</span></button>';
  section.insertBefore(challenge, section.querySelector('#choiceGrid'));
  let interval;
  let active = false;
  challenge.querySelector('.decision-start').addEventListener('click', () => {
    clearInterval(interval);
    let remaining = 3;
    active = true;
    challenge.querySelector('.decision-timer').textContent = '3.0s';
    challenge.querySelector('.decision-result').textContent = '';
    challenge.querySelector('.decision-start').classList.add('hidden');
    interval = setInterval(() => {
      remaining -= .1;
      challenge.querySelector('.decision-timer').textContent = `${Math.max(0, remaining).toFixed(1)}s`;
      if (remaining <= 0) {
        clearInterval(interval);
        active = false;
        challenge.querySelector('.decision-result').textContent = 'O tempo passou. Em uma situação real, não espere: peça ajuda e impeça que alguém alcoolizado dirija.';
        challenge.querySelector('.decision-start').classList.remove('hidden');
      }
    }, 100);
  });
  challenge.querySelectorAll('[data-decision]').forEach(button => button.addEventListener('click', () => {
    if (!active) return;
    clearInterval(interval);
    active = false;
    challenge.querySelector('.decision-result').textContent = button.dataset.decision === 'drive'
      ? 'ALERTA. Álcool e direção aumentam riscos. Procure uma alternativa segura.'
      : 'BOA PAUSA. Não deixe alguém alcoolizado dirigir; procure uma alternativa segura e um adulto de confiança.';
    challenge.querySelector('.decision-start').classList.remove('hidden');
    unlockDiscovery('choice');
  }));
}

function addCrisisSimulation() {
  const section = document.querySelector('#help .section-inner');
  const simulation = document.createElement('div');
  simulation.className = 'crisis-simulation';
  simulation.innerHTML = '<p class="panel-label">AGORA É SÉRIO <span>identifique sinais de emergência</span></p><h3>Alguém não está bem.</h3><p>Marque os sinais que exigem atendimento imediato:</p><div class="crisis-signs"><button type="button" data-crisis="unresponsive">Não responde</button><button type="button" data-crisis="breathing">Respiração anormal</button><button type="button" data-crisis="seizure">Convulsão</button><button type="button" data-crisis="unconscious">Está inconsciente</button></div><p class="crisis-result" aria-live="polite"></p>';
  section.insertBefore(simulation, section.querySelector('.help-grid'));
  simulation.querySelectorAll('[data-crisis]').forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('selected');
    simulation.querySelector('.crisis-result').textContent = 'Fique com a pessoa, não a deixe sozinha e ligue 192. Não ofereça café nem banho frio.';
    unlockDiscovery('crisis');
  }));
}

function addMirrorInvestigation() {
  const scene = document.querySelector('#mirror');
  const copy = scene.querySelector('.mirror-copy');
  const oldButton = copy.querySelector('.text-button');
  oldButton.classList.add('hidden');
  copy.querySelectorAll('.mirror-line,.mirror-slider-label,.outside-inside').forEach(element => { element.hidden = true; });
  scene.querySelector('.mirror-split').hidden = true;
  const investigation = document.createElement('div');
  investigation.className = 'mirror-investigation';
  investigation.innerHTML = '<p class="panel-label">INVESTIGAÇÃO // O ESPELHO <span>uma história pode ter mais de uma camada</span></p><h2>Você sabe por que<br><em>alguém bebeu?</em></h2><p class="mirror-question">Escolha uma explicação. Depois veja o que estava fora do seu campo de visão.</p><div class="mirror-theories"><button type="button" data-theory="fun">Porque queria se divertir</button><button type="button" data-theory="friends">Porque os amigos beberam</button><button type="button" data-theory="curiosity">Porque estava curioso</button><button type="button" data-theory="pain">Porque estava mal</button><button type="button" data-theory="unknown">Você não sabe</button></div><p class="mirror-verdict" aria-live="polite"></p><div class="mirror-fragments" hidden><p class="panel-label">FRAGMENTOS ENCONTRADOS</p><button type="button">01 · Ele disse que estava tudo bem.</button><button type="button">02 · Os amigos estavam bebendo.</button><button type="button">03 · Ele não queria parecer diferente.</button><button type="button">04 · Ninguém perguntou como ele estava.</button></div><div class="mirror-second" hidden><strong>Agora escolha novamente.</strong><p>O que poderia fazer você mudar de decisão?</p><div><button type="button" data-second="group">Se todo mundo estivesse fazendo</button><button type="button" data-second="friend">Se meu melhor amigo insistisse</button><button type="button" data-second="curiosity">Se eu estivesse muito curioso</button><button type="button" data-second="forget">Se eu estivesse tentando esquecer algo</button><button type="button" data-second="none">Nada disso</button></div><p class="mirror-reflection" aria-live="polite"></p></div><p class="mirror-conclusion" hidden>Você não viu a história inteira. Comportamentos relacionados ao álcool podem envolver pessoa, emoções, ambiente, curiosidade e pressão. Nenhuma dessas respostas define quem alguém é.</p><button class="text-button mirror-investigation-next hidden" type="button">CONTINUAR <span>→</span></button>';
  copy.prepend(investigation);
  const verdict = investigation.querySelector('.mirror-verdict');
  const fragments = investigation.querySelector('.mirror-fragments');
  const second = investigation.querySelector('.mirror-second');
  const conclusion = investigation.querySelector('.mirror-conclusion');
  investigation.querySelectorAll('[data-theory]').forEach(button => button.addEventListener('click', () => {
    investigation.querySelectorAll('[data-theory]').forEach(item => item.classList.toggle('selected', item === button));
    verdict.textContent = 'Você escolheu uma explicação. Mas você realmente sabe?';
    fragments.hidden = false;
    second.hidden = false;
  }));
  investigation.querySelectorAll('[data-second]').forEach(button => button.addEventListener('click', () => {
    investigation.querySelectorAll('[data-second]').forEach(item => item.classList.toggle('selected', item === button));
    const responses = { group: 'Então o grupo pode importar nessa situação.', friend: 'A insistência de alguém próximo pode mudar o contexto.', curiosity: 'Curiosidade também pode participar de uma decisão.', forget: 'Emoções difíceis podem influenciar escolhas.', none: 'Você não precisa encontrar uma explicação única.' };
    investigation.querySelector('.mirror-reflection').textContent = `${responses[button.dataset.second]} Nenhuma dessas respostas define quem você é.`;
    conclusion.hidden = false;
    investigation.querySelector('.mirror-investigation-next').classList.remove('hidden');
    unlockDiscovery('mirror');
  }));
  investigation.querySelector('.mirror-investigation-next').addEventListener('click', () => showScene('quiz'));
}

addFirstExperience();
addRoutineTimeline();
addRecoveryJourney();
addBrainLaboratory();
addAttentionChallenge();
addTimedDecision();
addCrisisSimulation();
addMirrorInvestigation();
addCuriosityReveal('#cycle', 'Por que uma coisa que alivia pode voltar ainda mais forte?', 'O alívio rápido pode ensinar o cérebro a repetir uma associação. Quando o efeito passa, o estresse continua ali.');
addCuriosityReveal('#choice', 'Você faria a mesma escolha se ninguém estivesse olhando?', 'Pertencer a um grupo e lidar com um dia difícil podem influenciar decisões. Isso não é um diagnóstico: é um convite para observar o contexto.');
addCuriosityReveal('#impact', 'Será que o copo fica só na sua mão?', 'Sono, humor, relações, estudos, trabalho e segurança também podem sentir efeitos. Cada pessoa tem uma história diferente.');

document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => showScene(button.dataset.next)));
navItems.forEach(item => item.addEventListener('click', () => showScene(item.dataset.target)));
window.addEventListener('hashchange', showSceneFromHash);
if (window.location.hash) showSceneFromHash();
else showScene('intro');
updateExperienceUI();
document.querySelector('#menuToggle').addEventListener('click', event => { const open = chapterNav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', open); });

document.querySelectorAll('.cycle-node').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.cycle-node').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  const [number, title, text] = cycleContent[button.dataset.cycle];
  document.querySelector('.message-number').textContent = number;
  document.querySelector('.cycle-message h3').textContent = title;
  document.querySelector('.cycle-message p').textContent = text;
  unlockDiscovery('cycle');
}));

document.querySelectorAll('.brain-tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.brain-tab').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('.brain-tab').forEach(item => item.setAttribute('aria-selected', String(item === button)));
  const [title, text] = brainContent[button.dataset.brain];
  document.querySelector('#brainMessage h3').textContent = title;
  document.querySelector('#brainMessage p').textContent = text;
  unlockDiscovery('brain');
}));

document.querySelectorAll('.choice-card').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.choice-card').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  document.querySelectorAll('.choice-card').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const messages = { talk: 'Você procurou presença. Uma escolha também pode ser pedir para não atravessar a noite sozinho.', walk: 'Você mudou o ritmo. Nem todo alívio precisa vir em um copo.', drink: 'Você escolheu beber. Na próxima semana, o dia difícil voltou. E a espera pelo fim do dia começou mais cedo.' };
  document.querySelector('#choiceResult').textContent = messages[button.dataset.choice];
  const path = { talk: [55, 20, 90, 18], walk: [45, 28, 70, 24], drink: [82, 70, 25, 68] }[button.dataset.choice];
  ['stress', 'isolation', 'support', 'risk'].forEach((name, index) => { document.querySelector(`[data-path="${name}"]`).style.width = `${path[index]}%`; });
  unlockDiscovery('choice');
  experienceStats.support = button.dataset.choice === 'talk' ? 60 : button.dataset.choice === 'walk' ? 40 : 20;
  experienceStats.stress = button.dataset.choice === 'drink' ? 65 : 25;
  localStorage.setItem('eraCopoStats', JSON.stringify(experienceStats));
  updateExperienceUI();
  document.querySelector('#choiceContinue').classList.remove('hidden');
}));

document.querySelectorAll('.impact-orbit').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.impact-orbit').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); }); button.classList.add('active'); button.setAttribute('aria-pressed', 'true'); document.querySelector('#impactDetail').textContent = impactContent[button.dataset.impact]; }));
document.querySelectorAll('.impact-orbit').forEach(button => button.addEventListener('click', () => unlockDiscovery('impact')));

document.querySelector('.scene-mirror .text-button').addEventListener('click', event => { const lines = document.querySelectorAll('.mirror-line'); const current = [...lines].findIndex(line => line.classList.contains('active')); if (current < lines.length - 1) { lines[current].classList.remove('active'); lines[current + 1].classList.add('active'); event.currentTarget.textContent = 'CONTINUAR  →'; } else showScene('quiz'); });
document.querySelector('#mirrorSlider').addEventListener('input', event => { const value = Number(event.currentTarget.value); document.querySelector('#outsideInside').style.opacity = `${0.55 + Math.abs(value - 50) / 110}`; document.querySelector('#outsideInside').style.transform = `translateX(${(value - 50) / 12}px)`; if (value > 85) unlockDiscovery('mirror'); });
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
  document.querySelector('#quizScore').textContent = `CONCEITOS DESCOBERTOS: ${quizIndex} / 10`;
  document.querySelector('#quizComplete').classList.add('hidden');
  document.querySelector('#quizContinue').classList.add('hidden');
  quizNext.classList.add('hidden');
  document.querySelectorAll('.quiz-options button').forEach(button => { button.disabled = false; button.classList.remove('selected'); button.classList.remove('correct'); });
}
renderQuiz();
document.querySelectorAll('.quiz-options button').forEach(button => button.addEventListener('click', () => {
  const correct = button.dataset.answer === quizData[quizIndex][1];
  if (correct) quizCorrect += 1;
  document.querySelectorAll('.quiz-options button').forEach(option => { option.disabled = true; option.classList.toggle('selected', option === button); });
  document.querySelector('#quizFeedback').textContent = `${correct ? 'VOCÊ DESCOBRIU. ' : 'QUASE. VAMOS ENTENDER. '}${quizData[quizIndex][2]}`;
  document.querySelector('#quizScore').textContent = `CONCEITOS DESCOBERTOS: ${quizIndex + 1} / 10`;
  if (quizIndex === quizData.length - 1) {
    unlockDiscovery('quiz');
    document.querySelector('#quizCorrect').textContent = quizCorrect;
    document.querySelector('#quizSummary').textContent = `${quizCorrect} de 10 respostas coincidiram com o gabarito. Cada resposta abriu uma conversa, não uma avaliação sobre você.`;
    document.querySelector('#quizComplete').classList.remove('hidden');
  }
  if (quizIndex < quizData.length - 1) quizNext.classList.remove('hidden');
  else document.querySelector('#quizContinue').classList.remove('hidden');
}));
quizNext.addEventListener('click', () => { quizIndex += 1; renderQuiz(); });

const factorExplanations = { estresse: 'Pressões acumuladas podem aumentar a busca por alívio, mas não determinam o caminho de ninguém.', pressao: 'Ambientes e expectativas sociais podem influenciar escolhas de consumo.', isolamento: 'Menos apoio pode tornar mais difícil perceber mudanças ou pedir ajuda.', apoio: 'Relações de confiança podem facilitar conversa, cuidado e recuperação.' };
document.querySelectorAll('.factor-grid button').forEach(button => button.addEventListener('click', () => { document.querySelector('#factorDetail').textContent = factorExplanations[button.dataset.factor]; }));
function animateCounter() { const counter = document.querySelector('[data-counter]'); if (counter.dataset.done) return; const target = Number(counter.dataset.counter); let current = 0; counter.textContent = target; const tick = () => { current += Math.ceil(target / 24); counter.textContent = Math.min(current, target); if (current < target) requestAnimationFrame(tick); else counter.dataset.done = 'true'; }; requestAnimationFrame(tick); }

document.querySelector('#themeToggle').addEventListener('click', () => document.body.classList.toggle('light'));
document.querySelector('#soundToggle').addEventListener('click', event => { const on = event.currentTarget.dataset.on !== 'true'; event.currentTarget.dataset.on = on; event.currentTarget.textContent = on ? '◉' : '◌'; event.currentTarget.title = on ? 'Som ambiente ativado' : 'Som ambiente desligado'; });
document.querySelector('#restartButton').addEventListener('click', () => { localStorage.removeItem('eraCopoVisited'); localStorage.removeItem('eraCopoDiscoveries'); localStorage.removeItem('eraCopoStats'); visited = []; discoveries = []; experienceStats = { knowledge: 0, support: 20, stress: 35 }; quizIndex = 0; quizCorrect = 0; glassTouches = 0; renderQuiz(); document.querySelector('#introWine').style.height = '0'; document.querySelector('#glassCaption').textContent = 'toque no copo · toque 0 de 5'; document.querySelector('#glassStage').className = 'glass-stage'; document.querySelectorAll('.glass-particle').forEach(particle => particle.remove()); document.querySelectorAll('.mirror-line').forEach((line, index) => line.classList.toggle('active', index === 0)); updateExperienceUI(); showScene('intro'); });
