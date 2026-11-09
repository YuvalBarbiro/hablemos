/* Curriculum — original content. Sequence merges Madrigal's Magic Key to Spanish
   (book lessons) with Language Transfer Complete Spanish (track ranges are approximate).
   Markup in concept text: **bold**, {{spanish}} = tappable Spanish (speaks aloud).
   vocab: [spanish, english, hebrew?]   sent: ['spanish|alternative', 'english'] */
window.UNITS = [
  { n: 1, title: 'Words you already know', desc: 'Sounds, look-alike words, and your first sentences with "es".' },
  { n: 2, title: 'First verbs', desc: 'Want, can, need — plus the past, questions, "it", estar and the future.' },
  { n: 3, title: '-er and -ir verbs', desc: 'The other two verb families, the past tense for everyone, plurals.' },
  { n: 4, title: 'The present', desc: 'Present tense, ser vs estar, -ing, and the key irregular verbs.' },
  { n: 5, title: 'Everyday life', desc: 'Have done, time & prices, stem changes, him/her/to him, likes, reflexives.' },
  { n: 6, title: 'Going further', desc: 'Used to, commands, tú, future & would, and the subjunctive.' }
];
window.LESSONS = [];
function L(o) { window.LESSONS.push(o); }

L({
  id: '1.1', unit: 1, title: 'The sounds of Spanish', sub: 'Five vowels, a few new consonants, where the stress goes',
  book: 'Pronunciation key', lt: [1, 1],
  concepts: [
    { h: 'Five pure vowels', p: 'Spanish vowels never change their sound. **a** = "ah", **e** = "eh" (bet), **i** = "ee" (see), **o** = "oh" (short and clean, no "w" at the end), **u** = "oo" (food). Every vowel is pronounced: {{bueno}} is bu-E-no.' },
    { h: 'Consonants that differ from English', p: '**h** is always silent: {{hotel}} = "otel". **j**, and **g** before e/i, are a throaty h: {{jamón}}, {{general}}. **ll** and **y** sound like the y in "yes": {{calle}}. **ñ** = "ny" as in canyon: {{mañana}}. **r** is a quick tap (like the tt in American "butter"); **rr**, and r at the start of a word, are rolled: {{perro}}. **z**, and **c** before e/i, sound like s in Latin America and "th" in most of Spain. **qu** = k: {{qué}}. **v** sounds almost like a soft b.',
      he: 'ה-j וה-g (לפני e/i) נשמעים כמו ח׳ בעברית. ה-r המתגלגלת (rr) נעשית עם קצה הלשון, לא בגרון.' },
    { h: 'Where the stress goes', p: 'Words ending in a **vowel, n or s** stress the next-to-last syllable: {{casa}} (CA-sa), {{hablan}} (HA-blan). Words ending in **any other consonant** stress the last syllable: {{hotel}}, {{hablar}}. A written accent overrides both rules: {{café}}, {{música}}.' }
  ],
  vocab: [
    ['hola', 'hello'], ['adiós', 'goodbye'], ['sí', 'yes'], ['no', 'no'], ['gracias', 'thank you'],
    ['por favor', 'please'], ['perdón', 'sorry / excuse me'], ['y', 'and'], ['muy', 'very'],
    ['bueno', 'good'], ['mañana', 'tomorrow'], ['hasta luego', 'see you later'], ['hasta mañana', 'see you tomorrow'],
    ['la calle', 'the street'], ['el perro', 'the dog']
  ],
  sent: [
    ['Hola, buenos días.', 'Hello, good morning.'],
    ['Sí, gracias.', 'Yes, thank you.'],
    ['No, gracias.', 'No, thank you.'],
    ['Muy bueno.', 'Very good.'],
    ['Hasta mañana.', 'See you tomorrow.'],
    ['Perdón, por favor.', 'Excuse me, please.'],
    ['Adiós y gracias.', 'Goodbye and thank you.']
  ]
});

L({
  id: '1.2', unit: 1, title: '-or and -al words', sub: 'Hundreds of free words, and "es" (is)',
  book: 'Lesson 1', lt: [1, 2],
  concepts: [
    { h: 'Words that are already Spanish', p: 'Many English words that end in **-or** and **-al** are exactly the same in Spanish. Only the pronunciation changes, with the stress on the last syllable: {{el doctor}}, {{el color}}, {{el animal}}, {{normal}}, {{natural}}, {{personal}}.' },
    { h: 'es = is', p: '{{es}} means "is", and also "it is", "he is", "she is", or "you are" (polite). Spanish doesn\'t need a word for "it": {{Es normal.}} = It\'s normal.' },
    { h: 'no es = is not', p: 'To make anything negative, put {{no}} in front of the verb: {{No es normal.}} = It isn\'t normal.' },
    { h: 'the and a', p: '{{el}} = the, {{un}} = a / an (for "masculine" words; more on that soon). {{El doctor es popular.}}' }
  ],
  vocab: [
    ['es', 'is / it is'], ['no es', 'is not'], ['el', 'the (masc.)'], ['un', 'a / an (masc.)'],
    ['el doctor', 'the doctor'], ['el actor', 'the actor'], ['el color', 'the color'], ['el error', 'the mistake / error'],
    ['el animal', 'the animal'], ['el hospital', 'the hospital'], ['normal', 'normal'], ['natural', 'natural'],
    ['legal', 'legal'], ['popular', 'popular'], ['central', 'central'], ['personal', 'personal'], ['ideal', 'ideal']
  ],
  sent: [
    ['Es normal.', 'It\'s normal.'],
    ['No es normal.', 'It isn\'t normal.'],
    ['Es muy natural.', 'It\'s very natural.'],
    ['El doctor es popular.', 'The doctor is popular.'],
    ['El error no es personal.', 'The mistake isn\'t personal.'],
    ['El hospital es central.', 'The hospital is central.'],
    ['Es un animal.', 'It\'s an animal.'],
    ['El color es ideal.', 'The color is ideal.'],
    ['No es legal.', 'It\'s not legal.'],
    ['Es un error.', 'It\'s a mistake.']
  ]
});

L({
  id: '1.3', unit: 1, title: '-ble, -ic, -ent, -ant', sub: 'More free words, "for me", and asking questions',
  book: 'Lesson 1', lt: [2, 4],
  concepts: [
    { h: '-ble stays -ble', p: '{{posible}}, {{probable}}, {{terrible}}, {{horrible}}, {{flexible}}. Stress the next-to-last syllable: po-SI-ble.' },
    { h: '-ic becomes -ico', p: 'Add an **o**: public → {{público}}, electric → {{eléctrico}}, romantic → {{romántico}}, fantastic → {{fantástico}}. The accent mark shows the stressed syllable.' },
    { h: '-ent and -ant add an -e', p: 'important → {{importante}}, intelligent → {{inteligente}}, different → {{diferente}}, excellent → {{excelente}}, the president → {{el presidente}}, the restaurant → {{el restaurante}}.' },
    { h: 'for me, for you', p: '{{para}} = for. {{para mí}} = for me, {{para usted}} = for you (polite "you"). {{Es posible para mí.}} = It\'s possible for me.' },
    { h: 'Questions', p: 'Just raise your voice at the end, or put the verb first: {{¿Es posible?}} = Is it possible? {{¿Es importante el accidente?}} Written questions also open with an upside-down ¿.' }
  ],
  vocab: [
    ['posible', 'possible'], ['imposible', 'impossible'], ['probable', 'probable / likely', 'סביר'], ['terrible', 'terrible'],
    ['fantástico', 'fantastic'], ['romántico', 'romantic'], ['eléctrico', 'electric'], ['importante', 'important'],
    ['inteligente', 'intelligent'], ['diferente', 'different'], ['excelente', 'excellent'], ['el presidente', 'the president'],
    ['el restaurante', 'the restaurant'], ['el accidente', 'the accident'], ['para', 'for'], ['para mí', 'for me'],
    ['para usted', 'for you (polite)']
  ],
  sent: [
    ['¿Es posible?', 'Is it possible?'],
    ['Es posible para mí.', 'It\'s possible for me.'],
    ['No es posible para usted.', 'It isn\'t possible for you.'],
    ['¿Es importante para usted?', 'Is it important for you?'],
    ['El restaurante es excelente.', 'The restaurant is excellent.'],
    ['El presidente es muy inteligente.', 'The president is very intelligent.'],
    ['¿Es diferente para mí?', 'Is it different for me?'],
    ['Es probable.', 'It\'s likely.'],
    ['El accidente es terrible.', 'The accident is terrible.'],
    ['Es fantástico.', 'It\'s fantastic.']
  ]
});

L({
  id: '1.4', unit: 1, title: '-ist, -ous, -tion', sub: 'Masculine and feminine: el / la, un / una',
  book: 'Lesson 2', lt: [4, 7],
  concepts: [
    { h: '-ist becomes -ista', p: 'The same word for men and women: {{el artista}} / {{la artista}}, {{el turista}}, {{el dentista}}.' },
    { h: '-ous becomes -oso', p: 'famous → {{famoso}}, generous → {{generoso}}, curious → {{curioso}}, delicious → {{delicioso}}.' },
    { h: '-tion becomes -ción', p: 'situation → {{la situación}}, information → {{la información}}, conversation → {{la conversación}}. Words in -sion become **-sión**: {{la decisión}}, {{la televisión}}. All of these are feminine.' },
    { h: 'Every noun is masculine or feminine', p: 'Masculine: {{el}} (the), {{un}} (a). Feminine: {{la}} (the), {{una}} (a). Words ending in **-o** are usually masculine, and words ending in **-a**, **-ción** or **-dad** are usually feminine. Adjectives ending in -o change to -a to match: {{el actor es famoso}}, {{la actriz es famosa}}. Adjectives ending in -e, -al or -ble don\'t change.',
      he: 'בדיוק כמו בעברית — לכל שם עצם יש מין (זכר/נקבה), ושם התואר מתאים את עצמו.' }
  ],
  vocab: [
    ['la', 'the (fem.)'], ['una', 'a / an (fem.)'], ['el artista', 'the artist'], ['el turista', 'the tourist'],
    ['el dentista', 'the dentist'], ['famoso', 'famous'], ['generoso', 'generous', 'נדיב'], ['curioso', 'curious', 'סקרן'],
    ['delicioso', 'delicious'], ['interesante', 'interesting'], ['la situación', 'the situation'], ['la información', 'the information'],
    ['la conversación', 'the conversation'], ['la decisión', 'the decision'], ['la opción', 'the option'], ['la televisión', 'the television']
  ],
  sent: [
    ['La situación es normal.', 'The situation is normal.'],
    ['La información es importante.', 'The information is important.'],
    ['El turista es curioso.', 'The tourist is curious.'],
    ['La conversación es muy interesante.', 'The conversation is very interesting.'],
    ['La artista es famosa.', 'The (female) artist is famous.'],
    ['Es una decisión importante.', 'It\'s an important decision.'],
    ['No es una opción para mí.', 'It isn\'t an option for me.'],
    ['¿Es delicioso?', 'Is it delicious?'],
    ['El dentista es muy generoso.', 'The dentist is very generous.'],
    ['Es una situación diferente.', 'It\'s a different situation.']
  ]
});

L({
  id: '1.5', unit: 1, title: '-ty and -ry', sub: 'Plus the little words that glue sentences together',
  book: 'Lessons 4–5', lt: [7, 8],
  concepts: [
    { h: '-ty becomes -dad', p: 'university → {{la universidad}}, possibility → {{la posibilidad}}, reality → {{la realidad}}, opportunity → {{la oportunidad}}. All feminine. One that\'s less obvious: {{la ciudad}} = the city.' },
    { h: '-ry becomes -rio / -ria', p: 'necessary → {{necesario}}, dictionary → {{el diccionario}}, history/story → {{la historia}}, vocabulary → {{el vocabulario}}.' },
    { h: 'Glue words', p: '{{y}} and · {{pero}} but · {{o}} or · {{también}} also, too · {{con}} with · {{sin}} without · {{en}} in, at, on · {{de}} of, from · {{grande}} big.' }
  ],
  vocab: [
    ['la universidad', 'the university'], ['la posibilidad', 'the possibility'], ['la realidad', 'the reality'],
    ['la oportunidad', 'the opportunity'], ['la ciudad', 'the city'], ['necesario', 'necessary'], ['el diccionario', 'the dictionary'],
    ['la historia', 'the history / story'], ['pero', 'but'], ['también', 'also / too'], ['o', 'or'], ['con', 'with'],
    ['sin', 'without'], ['en', 'in / at / on'], ['de', 'of / from'], ['grande', 'big']
  ],
  sent: [
    ['Es necesario.', 'It\'s necessary.'],
    ['No es necesario para mí.', 'It isn\'t necessary for me.'],
    ['Es una oportunidad fantástica.', 'It\'s a fantastic opportunity.'],
    ['La ciudad es grande y muy interesante.', 'The city is big and very interesting.'],
    ['Es posible, pero no es probable.', 'It\'s possible, but it isn\'t likely.'],
    ['El diccionario es necesario también.', 'The dictionary is necessary too.'],
    ['Es una realidad.', 'It\'s a reality.'],
    ['¿Con o sin información?', 'With or without information?'],
    ['La universidad es excelente.', 'The university is excellent.'],
    ['Es la historia de la ciudad.', 'It\'s the history of the city.']
  ]
});

/* ---------------- UNIT 2 ---------------- */

L({
  id: '2.1', unit: 2, title: 'Verbs for free: -ate → -ar', sub: 'I want, I can, I need + any verb',
  book: 'Lessons 3 & 6', lt: [8, 12],
  concepts: [
    { h: 'English -ate verbs become -ar', p: 'separate → {{separar}}, prepare → {{preparar}}, celebrate → {{celebrar}}, participate → {{participar}}, communicate → {{comunicar}}. Many everyday verbs end in -ar too: {{hablar}} (to speak), {{comprar}} (to buy), {{tomar}} (to take / to drink), {{visitar}}, {{usar}}.' },
    { h: 'The -ar form means "to ..."', p: 'This basic form is the **infinitive**: {{hablar}} = to speak. A -ción word usually has a matching verb: {{la preparación}} → {{preparar}}, {{la invitación}} → {{invitar}}.',
      he: 'infinitive = שם הפועל (כמו "לדבר", "לקנות").' },
    { h: 'Three power verbs', p: '{{quiero}} I want · {{puedo}} I can · {{necesito}} I need. Put any infinitive after them: {{Quiero hablar.}} = I want to speak. There\'s no separate word for "to". For "you" (polite) or he/she, use {{quiere}}, {{puede}}, {{necesita}}: {{¿Quiere visitar la ciudad?}}' },
    { h: 'No "do"', p: 'Spanish has no helper "do". Questions and negatives just use the verb: {{¿Puede hablar?}} = Can you speak? {{No quiero.}} = I don\'t want to.' }
  ],
  vocab: [
    ['hablar', 'to speak'], ['preparar', 'to prepare'], ['visitar', 'to visit'], ['invitar', 'to invite'],
    ['comprar', 'to buy'], ['tomar', 'to take / to drink'], ['usar', 'to use'], ['celebrar', 'to celebrate'],
    ['necesitar', 'to need'], ['quiero', 'I want'], ['quiere', 'you want / he, she wants'], ['puedo', 'I can'],
    ['puede', 'you can / he, she can'], ['necesito', 'I need'], ['ahora', 'now'], ['hoy', 'today'], ['español', 'Spanish']
  ],
  sent: [
    ['Quiero hablar.', 'I want to speak.'],
    ['Quiero hablar español.', 'I want to speak Spanish.'],
    ['No puedo hablar ahora.', 'I can\'t speak now.'],
    ['¿Quiere visitar la ciudad?', 'Do you want to visit the city?'],
    ['Necesito comprar un diccionario.', 'I need to buy a dictionary.'],
    ['¿Puede preparar la información?', 'Can you prepare the information?'],
    ['Quiero celebrar hoy.', 'I want to celebrate today.'],
    ['Puedo usar el teléfono.', 'I can use the phone.'],
    ['¿Puede hablar con el presidente?', 'Can you speak with the president?'],
    ['No necesito tomar una decisión ahora.', 'I don\'t need to make a decision now.']
  ]
});

L({
  id: '2.2', unit: 2, title: 'The past: I did, you did', sub: '-é for "I", -ó for "you / he / she"',
  book: 'Lessons 4, 5, 7', lt: [20, 23],
  concepts: [
    { h: '"I did" = -é', p: 'Drop -ar and add **-é**: hablar → {{hablé}} (I spoke), comprar → {{compré}} (I bought), tomar → {{tomé}} (I took / drank), visitar → {{visité}}.' },
    { h: '"You / he / she did" = -ó', p: 'Add **-ó**: {{habló}} (you / he / she spoke), {{compró}}, {{tomó}}. The stress is on that last syllable.' },
    { h: 'Stress changes meaning', p: '{{hablo}} (HA-blo) = I speak, but {{habló}} (ha-BLÓ) = he spoke. Listen for it.' },
    { h: 'Subject pronouns are optional', p: '{{yo}} I · {{usted}} you (polite) · {{él}} he · {{ella}} she. The verb ending already tells you who, so these are mostly for emphasis or clarity: {{¿Habló usted con el doctor?}}' }
  ],
  vocab: [
    ['hablé', 'I spoke'], ['habló', 'you / he / she spoke'], ['compré', 'I bought'], ['compró', 'you / he / she bought'],
    ['tomé', 'I took / I drank'], ['tomó', 'you / he / she took'], ['visité', 'I visited'], ['preparé', 'I prepared'],
    ['yo', 'I'], ['usted', 'you (polite)'], ['él', 'he'], ['ella', 'she'], ['ayer', 'yesterday'], ['anoche', 'last night'],
    ['esta mañana', 'this morning'], ['el café', 'the coffee'], ['la cena', 'the dinner'], ['el museo', 'the museum']
  ],
  sent: [
    ['Hablé con el doctor.', 'I spoke with the doctor.'],
    ['¿Habló usted con el presidente?', 'Did you speak with the president?'],
    ['Compré un diccionario ayer.', 'I bought a dictionary yesterday.'],
    ['¿Compró la televisión?', 'Did you buy the television?'],
    ['Tomé un café esta mañana.', 'I had a coffee this morning.'],
    ['Ella visitó la universidad.', 'She visited the university.'],
    ['Él no habló.', 'He didn\'t speak.'],
    ['Preparé la cena anoche.', 'I made dinner last night.'],
    ['¿Tomó usted una decisión?', 'Did you make a decision?'],
    ['No visité el museo.', 'I didn\'t visit the museum.']
  ]
});

L({
  id: '2.3', unit: 2, title: 'Questions and "it"', sub: 'What, where, when, why, and lo / la',
  book: 'Lesson 8', lt: [12, 15],
  concepts: [
    { h: 'Question words', p: '{{¿qué?}} what · {{¿dónde?}} where · {{¿cuándo?}} when · {{¿por qué?}} why · {{¿quién?}} who · {{¿cómo?}} how. Note that {{porque}} (one word, no accent) = because.' },
    { h: 'it = lo / la', p: '{{lo}} = it (masculine thing, and also "him"), {{la}} = it (feminine thing, and also "her"). It goes **before** the verb: {{Lo compré.}} = I bought it. {{¿Lo quiere?}} = Do you want it?',
      he: 'lo ≈ "אותו", la ≈ "אותה" — "קניתי אותו" = Lo compré.' },
    { h: 'With an infinitive, stick it on the end', p: '{{Quiero comprarlo.}} = I want to buy it. Putting it in front also works: {{Lo quiero comprar.}}' }
  ],
  vocab: [
    ['¿qué?', 'what?'], ['¿dónde?', 'where?'], ['¿cuándo?', 'when?'], ['¿por qué?', 'why?'], ['porque', 'because'],
    ['¿quién?', 'who?'], ['¿cómo?', 'how?'], ['lo', 'it / him'], ['la', 'it / her'], ['algo', 'something'], ['nada', 'nothing']
  ],
  sent: [
    ['¿Qué compró?', 'What did you buy?'],
    ['¿Dónde lo compró?', 'Where did you buy it?'],
    ['Lo compré ayer.', 'I bought it yesterday.'],
    ['¿Por qué no lo quiere?', 'Why don\'t you want it?'],
    ['Quiero comprarlo.|Lo quiero comprar.', 'I want to buy it.'],
    ['No puedo prepararlo ahora.|No lo puedo preparar ahora.', 'I can\'t prepare it now.'],
    ['¿Cuándo habló con el doctor?', 'When did you speak with the doctor?'],
    ['¿Quién lo preparó?', 'Who prepared it?'],
    ['No lo necesito porque no es necesario.', 'I don\'t need it because it isn\'t necessary.'],
    ['¿Cómo lo preparó?', 'How did you prepare it?']
  ]
});

L({
  id: '2.4', unit: 2, title: 'Greetings and estar', sub: 'How are you? Where is it? The second "to be"',
  book: 'Lessons 9 & 20', lt: [15, 18],
  concepts: [
    { h: 'Two verbs for "to be"', p: '{{es}} (from **ser**) says **what** something is: its identity and characteristics. **estar** says **how** or **where** something is right now: states, feelings, locations. {{Es inteligente.}} = He\'s intelligent. {{Está cansado.}} = He\'s tired.',
      he: 'ser = מהות (מה הדבר), estar = מצב או מיקום (איך/איפה הוא עכשיו).' },
    { h: 'estar', p: '{{estoy}} I am · {{está}} you are / he, she, it is · {{estamos}} we are · {{están}} they are / you all are.' },
    { h: 'Greetings', p: '{{buenos días}} good morning · {{buenas tardes}} good afternoon · {{buenas noches}} good evening / night · {{¿Cómo está?}} How are you? · {{Estoy bien.}} I\'m fine. · {{mucho gusto}} nice to meet you.' }
  ],
  vocab: [
    ['estoy', 'I am (state / place)'], ['está', 'you are / he, she, it is'], ['estamos', 'we are'], ['están', 'they are'],
    ['bien', 'well / fine'], ['mal', 'bad / badly'], ['cansado', 'tired', 'עייף'], ['ocupado', 'busy', 'עסוק'],
    ['contento', 'happy / pleased'], ['aquí', 'here'], ['allí', 'there'], ['en casa', 'at home'],
    ['buenos días', 'good morning'], ['buenas tardes', 'good afternoon'], ['buenas noches', 'good evening / night'], ['mucho gusto', 'nice to meet you']
  ],
  sent: [
    ['¿Cómo está usted?|¿Cómo está?', 'How are you?'],
    ['Estoy muy bien, gracias.', 'I\'m very well, thank you.'],
    ['¿Dónde está el restaurante?', 'Where is the restaurant?'],
    ['El hotel está aquí.', 'The hotel is here.'],
    ['Estoy cansado hoy.|Hoy estoy cansado.', 'I\'m tired today.'],
    ['Ella está en casa.', 'She\'s at home.'],
    ['¿Está ocupado ahora?', 'Are you busy now?'],
    ['Estamos contentos.', 'We\'re happy.'],
    ['No están aquí.', 'They aren\'t here.'],
    ['Buenos días, mucho gusto.', 'Good morning, nice to meet you.']
  ]
});

L({
  id: '2.5', unit: 2, title: 'The future: voy a…', sub: '"Going to" + any verb, and -ive → -ivo',
  book: 'Lessons 11–12', lt: [24, 27],
  concepts: [
    { h: 'going to = ir a', p: '{{voy a}} I\'m going to · {{va a}} you\'re / he\'s / she\'s going to · {{vamos a}} we\'re going to · {{van a}} they\'re going to. Add any infinitive: {{Voy a trabajar.}} = I\'m going to work.' },
    { h: '"Let\'s..."', p: '{{vamos a}} + verb also means "let\'s": {{¡Vamos a celebrar!}} = Let\'s celebrate!' },
    { h: 'It, with going to', p: 'Attach it to the end or put it in front: {{Voy a comprarlo.}} = {{Lo voy a comprar.}}' },
    { h: '-ive becomes -ivo', p: '{{activo}}, {{positivo}}, {{negativo}}, {{creativo}}. Feminine: {{una persona creativa}}.' }
  ],
  vocab: [
    ['voy a', 'I\'m going to'], ['va a', 'you\'re / he\'s going to'], ['vamos a', 'we\'re going to / let\'s'], ['van a', 'they\'re going to'],
    ['mañana', 'tomorrow'], ['esta noche', 'tonight'], ['más tarde', 'later'], ['la próxima semana', 'next week'],
    ['trabajar', 'to work'], ['descansar', 'to rest'], ['llamar', 'to call'], ['activo', 'active'], ['positivo', 'positive'],
    ['creativo', 'creative'], ['la persona', 'the person']
  ],
  sent: [
    ['Voy a trabajar mañana.|Mañana voy a trabajar.', 'I\'m going to work tomorrow.'],
    ['¿Va a llamarlo?|¿Lo va a llamar?', 'Are you going to call him?'],
    ['Vamos a celebrar esta noche.', 'We\'re going to celebrate tonight.'],
    ['No voy a comprarlo.|No lo voy a comprar.', 'I\'m not going to buy it.'],
    ['Van a descansar más tarde.', 'They\'re going to rest later.'],
    ['Ella va a preparar la cena.', 'She\'s going to make dinner.'],
    ['¿Qué va a comprar?', 'What are you going to buy?'],
    ['Voy a visitar la ciudad la próxima semana.', 'I\'m going to visit the city next week.'],
    ['Es una persona muy creativa.', 'He / She is a very creative person.'],
    ['Es muy positivo.', 'It\'s very positive.']
  ]
});

L({
  id: '2.6', unit: 2, title: 'Days and numbers 1–20', sub: 'What day is it? On Monday, on Mondays',
  book: 'Lessons 12 & 28', lt: null,
  concepts: [
    { h: 'Days of the week', p: 'Days are lowercase: {{lunes}}, {{martes}}, {{miércoles}}, {{jueves}}, {{viernes}}, {{sábado}}, {{domingo}}. {{el lunes}} = on Monday, {{los lunes}} = on Mondays. {{el fin de semana}} = the weekend.' },
    { h: 'Numbers 1–20', p: '{{uno}} {{dos}} {{tres}} {{cuatro}} {{cinco}} {{seis}} {{siete}} {{ocho}} {{nueve}} {{diez}} · {{once}} {{doce}} {{trece}} {{catorce}} {{quince}} · {{dieciséis}} {{diecisiete}} {{dieciocho}} {{diecinueve}} {{veinte}}' }
  ],
  vocab: [
    ['lunes', 'Monday'], ['martes', 'Tuesday'], ['miércoles', 'Wednesday'], ['jueves', 'Thursday'], ['viernes', 'Friday'],
    ['sábado', 'Saturday'], ['domingo', 'Sunday'], ['el fin de semana', 'the weekend'], ['uno', 'one'], ['dos', 'two'],
    ['tres', 'three'], ['cuatro', 'four'], ['cinco', 'five'], ['seis', 'six'], ['siete', 'seven'], ['ocho', 'eight'],
    ['nueve', 'nine'], ['diez', 'ten'], ['once', 'eleven'], ['doce', 'twelve'], ['quince', 'fifteen'], ['veinte', 'twenty']
  ],
  sent: [
    ['Hoy es lunes.', 'Today is Monday.'],
    ['¿Qué día es hoy?', 'What day is it today?'],
    ['Voy a trabajar el sábado.', 'I\'m going to work on Saturday.'],
    ['No voy a trabajar el domingo.', 'I\'m not going to work on Sunday.'],
    ['Trabajé el viernes.', 'I worked on Friday.'],
    ['Necesito dos cafés, por favor.', 'I need two coffees, please.'],
    ['Vamos a descansar el fin de semana.', 'We\'re going to rest on the weekend.'],
    ['¿Va a visitar el museo el jueves?', 'Are you going to visit the museum on Thursday?']
  ]
});
