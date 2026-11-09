/* Reference material: cognate rules, verb tables, pronouns, Language Transfer track links. */
window.COGNATES = [
  ['-or', '-or', 'doctor → doctor, color → color'],
  ['-al', '-al', 'normal → normal, animal → animal'],
  ['-ble', '-ble', 'possible → posible, terrible → terrible'],
  ['-ic', '-ico', 'public → público, electric → eléctrico'],
  ['-ent / -ant', '-ente / -ante', 'important → importante, president → presidente'],
  ['-ist', '-ista', 'artist → artista, tourist → turista'],
  ['-ous', '-oso', 'famous → famoso, curious → curioso'],
  ['-tion', '-ción (fem.)', 'nation → nación, situation → situación'],
  ['-sion', '-sión (fem.)', 'decision → decisión, television → televisión'],
  ['-ty', '-dad (fem.)', 'university → universidad, reality → realidad'],
  ['-ry', '-rio / -ria', 'necessary → necesario, history → historia'],
  ['-ive', '-ivo', 'active → activo, creative → creativo'],
  ['-ce / -cy', '-cia', 'distance → distancia, democracy → democracia'],
  ['-ine / -in', '-ina', 'medicine → medicina, vitamin → vitamina'],
  ['-ct', '-cto', 'perfect → perfecto, product → producto'],
  ['-ure', '-ura', 'culture → cultura, literature → literatura'],
  ['-ute', '-uto', 'minute → minuto, absolute → absoluto'],
  ['-cle', '-culo', 'vehicle → vehículo, obstacle → obstáculo'],
  ['-y (-gy, -phy)', '-ía', 'geography → geografía, energy → energía'],
  ['-em / -am', '-ema / -ama (masc.!)', 'problem → el problema, program → el programa'],
  ['-ly', '-mente', 'exactly → exactamente, normally → normalmente'],
  ['-ate (verb)', '-ar', 'separate → separar, celebrate → celebrar'],
  ['-ize (verb)', '-izar', 'organize → organizar, realize → realizar']
];

window.PERSONS = ['yo', 'tú', 'él / ella / usted', 'nosotros', 'ellos / ustedes'];

window.conjugate = function (inf) {
  const t = inf.slice(-2), s = inf.slice(0, -2);
  const E = {
    ar: { Present: ['o', 'as', 'a', 'amos', 'an'], Preterite: ['é', 'aste', 'ó', 'amos', 'aron'], Imperfect: ['aba', 'abas', 'aba', 'ábamos', 'aban'], Subjunctive: ['e', 'es', 'e', 'emos', 'en'] },
    er: { Present: ['o', 'es', 'e', 'emos', 'en'], Preterite: ['í', 'iste', 'ió', 'imos', 'ieron'], Imperfect: ['ía', 'ías', 'ía', 'íamos', 'ían'], Subjunctive: ['a', 'as', 'a', 'amos', 'an'] },
    ir: { Present: ['o', 'es', 'e', 'imos', 'en'], Preterite: ['í', 'iste', 'ió', 'imos', 'ieron'], Imperfect: ['ía', 'ías', 'ía', 'íamos', 'ían'], Subjunctive: ['a', 'as', 'a', 'amos', 'an'] }
  }[t];
  const out = {};
  for (const k of ['Present', 'Preterite', 'Imperfect']) out[k] = E[k].map(e => s + e);
  out.Future = ['é', 'ás', 'á', 'emos', 'án'].map(e => inf + e);
  out.Conditional = ['ía', 'ías', 'ía', 'íamos', 'ían'].map(e => inf + e);
  out.Subjunctive = E.Subjunctive.map(e => s + e);
  return out;
};

window.IRREGULAR = {
  ser: { Present: 'soy eres es somos son', Preterite: 'fui fuiste fue fuimos fueron', Imperfect: 'era eras era éramos eran', Future: 'seré serás será seremos serán', Conditional: 'sería serías sería seríamos serían', Subjunctive: 'sea seas sea seamos sean' },
  estar: { Present: 'estoy estás está estamos están', Preterite: 'estuve estuviste estuvo estuvimos estuvieron', Imperfect: 'estaba estabas estaba estábamos estaban', Future: 'estaré estarás estará estaremos estarán', Conditional: 'estaría estarías estaría estaríamos estarían', Subjunctive: 'esté estés esté estemos estén' },
  ir: { Present: 'voy vas va vamos van', Preterite: 'fui fuiste fue fuimos fueron', Imperfect: 'iba ibas iba íbamos iban', Future: 'iré irás irá iremos irán', Conditional: 'iría irías iría iríamos irían', Subjunctive: 'vaya vayas vaya vayamos vayan' },
  tener: { Present: 'tengo tienes tiene tenemos tienen', Preterite: 'tuve tuviste tuvo tuvimos tuvieron', Imperfect: 'tenía tenías tenía teníamos tenían', Future: 'tendré tendrás tendrá tendremos tendrán', Conditional: 'tendría tendrías tendría tendríamos tendrían', Subjunctive: 'tenga tengas tenga tengamos tengan' },
  hacer: { Present: 'hago haces hace hacemos hacen', Preterite: 'hice hiciste hizo hicimos hicieron', Imperfect: 'hacía hacías hacía hacíamos hacían', Future: 'haré harás hará haremos harán', Conditional: 'haría harías haría haríamos harían', Subjunctive: 'haga hagas haga hagamos hagan' },
  poder: { Present: 'puedo puedes puede podemos pueden', Preterite: 'pude pudiste pudo pudimos pudieron', Imperfect: 'podía podías podía podíamos podían', Future: 'podré podrás podrá podremos podrán', Conditional: 'podría podrías podría podríamos podrían', Subjunctive: 'pueda puedas pueda podamos puedan' },
  querer: { Present: 'quiero quieres quiere queremos quieren', Preterite: 'quise quisiste quiso quisimos quisieron', Imperfect: 'quería querías quería queríamos querían', Future: 'querré querrás querrá querremos querrán', Conditional: 'querría querrías querría querríamos querrían', Subjunctive: 'quiera quieras quiera queramos quieran' },
  decir: { Present: 'digo dices dice decimos dicen', Preterite: 'dije dijiste dijo dijimos dijeron', Imperfect: 'decía decías decía decíamos decían', Future: 'diré dirás dirá diremos dirán', Conditional: 'diría dirías diría diríamos dirían', Subjunctive: 'diga digas diga digamos digan' },
  venir: { Present: 'vengo vienes viene venimos vienen', Preterite: 'vine viniste vino vinimos vinieron', Imperfect: 'venía venías venía veníamos venían', Future: 'vendré vendrás vendrá vendremos vendrán', Conditional: 'vendría vendrías vendría vendríamos vendrían', Subjunctive: 'venga vengas venga vengamos vengan' },
  dar: { Present: 'doy das da damos dan', Preterite: 'di diste dio dimos dieron', Imperfect: 'daba dabas daba dábamos daban', Future: 'daré darás dará daremos darán', Conditional: 'daría darías daría daríamos darían', Subjunctive: 'dé des dé demos den' },
  saber: { Present: 'sé sabes sabe sabemos saben', Preterite: 'supe supiste supo supimos supieron', Imperfect: 'sabía sabías sabía sabíamos sabían', Future: 'sabré sabrás sabrá sabremos sabrán', Conditional: 'sabría sabrías sabría sabríamos sabrían', Subjunctive: 'sepa sepas sepa sepamos sepan' },
  ver: { Present: 'veo ves ve vemos ven', Preterite: 'vi viste vio vimos vieron', Imperfect: 'veía veías veía veíamos veían', Future: 'veré verás verá veremos verán', Conditional: 'vería verías vería veríamos verían', Subjunctive: 'vea veas vea veamos vean' }
};

window.TENSE_INFO = {
  Present: 'I speak / I\'m speaking',
  Preterite: 'I spoke (completed)',
  Imperfect: 'I used to speak / was speaking',
  Future: 'I will speak',
  Conditional: 'I would speak',
  Subjunctive: '(that) I speak — after wishes, doubts'
};

window.PRONOUNS = [
  ['Subject', 'yo', 'tú', 'él / ella / usted', 'nosotros', 'ellos / ellas / ustedes'],
  ['Direct (him, it)', 'me', 'te', 'lo / la', 'nos', 'los / las'],
  ['Indirect (to him)', 'me', 'te', 'le (se)', 'nos', 'les (se)'],
  ['Reflexive (self)', 'me', 'te', 'se', 'nos', 'se'],
  ['Possessive', 'mi', 'tu', 'su', 'nuestro', 'su']
];

/* Language Transfer — Complete Spanish (90 tracks) on SoundCloud */
window.LT_BASE = 'https://soundcloud.com/languagetransfer/';
window.LT_TRACKS = (function () {
  const out = [];
  for (let n = 1; n <= 90; n++) {
    let slug;
    if (n === 3) slug = 'complete-spanish-track-3-language-transfer-the-thinking-method-1';
    else if (n <= 15) slug = 'complete-spanish-track-' + n + '-language-transfer-the-thinking-method';
    else if (n === 90) slug = 'complete-spanish-track-90-end';
    else slug = 'complete-spanish-track-' + n;
    out.push(window.LT_BASE + slug + '?in=languagetransfer/sets/complete-spanish');
  }
  return out;
})();
window.LT_PLAYLIST = 'https://soundcloud.com/languagetransfer/sets/complete-spanish';
