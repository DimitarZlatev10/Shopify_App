import {
  sanitizeHtmlString,
  jsDomParser,
  createHrefTags,
  nestHTags,
} from "./toc-functions.js";
export default function createToc(htmlString) {

//   const htmlString = `<div class="prose prose-2xl text-black mx-auto mt-8 px-8 prose-img:rounded-xl">
  
//   <p>PrimeWorkout</p>
// <p><span>Нашата формула е специално подбрана комбинация от натурални съставки, които ще подпомогнат вашата ефикасност по време на тренировъчния процес, както във&nbsp; физически, така и в психически аспект.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">За разлика от другите&nbsp; предтренировъчни продукти, приемът на Prime Workout ще ви осигури постоянни нива на енергия и концентрация и ще предостави условия за оптимално възстановяване на вашия организъм.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ефектите от приема на Prime Workout които ще усетите засягат различни аспекти от тренировчния процес и ще ви подготви за по-тежките последващи тренировки.</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"></span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Описание на Prime Workout:&nbsp;</span></h2>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-opisanie-bilki._480x480.webp?v=1710773939" alt="описание на хранителна добавка prime workout" style="margin-bottom: 16px; float: none;"></div>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">“Prime Workout” представлява уникална по рода си формула, която съчетава в себе си две натурални аминокиселини и пет растения, които имат доказани качества за човешкото тяло.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Комбинацията е изключително интересна, поради това че адресира двата най-важни аспекта на всяка тренировка - физическия и нервно-психическия.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Същността на тренировъчния процес представлява да научим мозъкът и волята си да поставя все по-трудни препятствия пред нашето тяло и по този начин да подобряваме физическата си форма. Това ангажира изключително много нашата нервна система, както и скелетно-мускулния ни апарат.&nbsp;</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Поради това, възстановителните процеси трябва да са адекватни и реципрочни според натоварването.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Комбинацията от съставки в нашия продукт дава на тялото ни необходимото, за да може да даде всичко от себе си във физическия аспект, а също така бленда от адаптогенни и стимулиращи билки правят това възможно.&nbsp;</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">“PrimeWorkout” съдържа аминокиселината Аргинин и непротеиновата аминокиселина с витаминна природа Л-карнитин, както и няколко растения с доказан ефект :</span></p>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
// <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Аргинин AKG</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - има съдоразширяващ ефект, подпомага храненето на мускулите и допринася за “напомпващия ефект”</span>
// </li>
// </ul>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
// <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-Карнитин тартрат </span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">- аминокиселина с витаминна природа, отговорен за синтеза на енергия в клетките и повишава издръжливостта</span>
// </li>
// </ul>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
// <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзея корен екстракт</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - адаптогенна билка, за която се твърди, че повишава силата, мускулната маса и либидото при мъжа, както и протеиновия синтез</span>
// </li>
// </ul>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
// <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирски Женшен екстракт </span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">- адаптогенна билка, която подобрява концентрацията и нормализира нивата на стресовия хормон кортизол</span>
// </li>
// </ul>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
// <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалски чай екстракт </span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">- отново адаптогенна билка, известна като българската виагра. Повишава тонуса и чувството за сила, има качества на афродизиак.</span>
// </li>
// </ul>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
// <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешки бодил екстракт</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - притежава възбуждащ ефект върху нервната система и стимулира сърдечната дейност</span>
// </li>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
// <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зелен чай екстракт</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - енергетик, антиоксидант, притежава стимулиращо действие върху ЦНС.</span>
// </li>
// </ul>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Л- аргинин:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="действие на л аргинин тостесторен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/povishen-testosteron-vitaon....._480x480.webp?v=1707831794"></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-аргинин е незаменима аминокиселина, която тялото ни не може да синтезира и си я набавя чрез храната, която поемаме.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-аргинин е прекурсор на азотния оксид. Тази молекула има редица роли в&nbsp; човешкото тяло. Отговаря за клетъчната сигнализация между клетките на имунната система и регулира имунния отговор.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той влиза в състава на протеините и участва в анаболните процеси</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Освен това е една от трите аминокиселини, от които се образува креатина. Креатинът, под неговата активна форма, креатин фосфат е енергоносеща молекула отговорна за синтеза на&nbsp; АТФ. Особено нужен е по време на физическо натоварване, където служи за отдаване на фосфатна група към молекулата на Аденозин дифосфат, превръщайки го в АТФ.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Азотният окис, освен като клетъчен сигнализатор, изпълнява ролята и на мощен вазодилататор - това означава, че той има способността да разширява кръвоносните съдове. По този начин се осъществява повишаване на кръвотока в скелетната мускулатура, което води до:</span></p>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="font-weight: 400;" data-mce-style="font-weight: 400;">засилен транспорт на глюкоза и аминокиселини в мускулните клетки, подпомагайки анаболитните и възстановителните процеси</span></li>
// </ul>
// <ul>
// <li style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="font-weight: 400;" data-mce-style="font-weight: 400;">повишено активно отделяне на токсични продукти от мускулните клетки, които са отговорни за мускулната умора и намаляване на силата, а именно млечната киселина.</span></li>
// </ul>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В резултат имаме по-здрави, по-издръжливи и по-силни мускули, които могат да преодоляват по-тежки и интензивни натоварвания.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="primeworkout infografika" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout_480x480.webp?v=1702302790"></span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ползите от приема на Л-аргинин не свършват дотук.&nbsp;</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съществуват проучвания, които доказват, че приемът на аминокиселината през устата може да доведе до повишение в серумните нива на хормона на растежа до 100%. В същото проучване, нивата на хормон на растежа при физически натоварвания, съчетани с прием на Л-аргинин, може да се повиши от 300 до 500%.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това са статистически значими следствия от приема на аминокиселината. Хормонът на растежа е отговорен за мускулния растеж, метаболизма на хранителни вещества. Повишените стойности около физически стимули води до подобряване на спортните постижения, нарастване на мускулната маса и по-добро възстановяване.</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Л-карнитин:</span></h2>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="prime workout за енергия" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/hranitelni-dobavki-za-energiya._480x480.webp?v=1710772211"></div>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-карнитин е вещество с аминокиселинна природа, което не се включва в състава на белтъчините. По същество представлява витамин.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той е условно незаменим, което ще рече, че освен при определени условия, нуждите на организма ни от Л-карнитин, никога не превъзхождат способността на тялото ни да го синтезира.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Разбира се, това не означава, че допълнителния&nbsp; му прием е излишен.&nbsp;</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">За да извлечем ползите от него, свързани със спорта ни трябват по-големи количества, които да повишават концентрацията му в плазмата. Това не може да се случи, ако оставим на организмът ни сам да го произведе.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Основната роля на това вещество е&nbsp; да участва в процесите, свързани с обмен на енергия и по-скоро изгарянето на енергия.&nbsp;</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той служи като транспорт на мастните киселини до митохондриите, където се подлагат на процес на окисление и се разграждат до лесно усвоима енергия.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Особено ефективен е върху физическото представяне при хора, практикуващи спортове, свързани с издръжливост - бягане, плуване, колоездене.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Подобрява мускулната издръжливост при аеробни натоварвания; ускорява метаболизма.</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на левзеята:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="стрес напрежение левзея" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/stres-naprejenie-vitaon.._480x480.webp?v=1707830065"></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзеята е адаптогенна билка, разпространена най-вече в Сибир, Северна Русия и Казахстан. Коренът и е богат на активни вторични метаболити. Най-известните са от групата на сапонините - бета-екдистерона.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">На него дължим ефектите на билката върху тялото ни. Те са разнообразни - помага ни да се справяме със стреса, както физическия, така и психо-емоционалния.&nbsp;</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Освен това Левзеята е мощен афродизиак и се счита, че подобрява половата мощ.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Липсват убедителни проучвания, но все пак съществуват данни,че приемът и води до нарастване на мускулната маса, увеличаване на анаболния синтез, както и подобряване на силовата издръжливост.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзеята съдържа в себе си вторични метаболити, които имат изразени антиоксидантни свойства и допринасят за деактивирането на свободните радикали, които са плод от мускулния метаболизъм.</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Сибирския Женшен:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="сибирски жен шен корен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/jen-shen-koren_480x480.webp?v=1705048986"></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирският Женшен е лечебно растение, чиито качества са световно известни и признати.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той е богат на активни вторични метаболити, които участват в редица процеси, извършвани в човешкото тяло. Те са причината за полезните свойства на билката върху организма ни.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Счита се, че Сибирския Женшен е мощен адаптоген. Помага при справяне със стресови ситуации и потиска нивата на кортизола.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Регулира енергийните нива и ги разпределя правилно, за да може да подсигури плавен приток на енергия, без пикове и спадове, както е характерно за стимулантите.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той притежава силно антиоксидантно действие и помага за детоксикиране на тялото, както и за подобряване на средата за извършване на физиологични процеси.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съществуват данни, че тази билка играе роля в хомеостазата на половите хормони, като приемът му води до повишаване на нивата на свободния тестостерон.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Женшенът помага на организма ни да работи в екстремни условия. Той има положително влияние върху централната нервна система. Регулира настроението и фокуса, подобрява когнитивните способности.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ефективен е за употреба от спортисти, повишава мускулната издръжливост и подобрява притока на кръв към мозъка и към крайниците ни.</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Мурсалския чай:</span></h2>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/mursalski-chai-opisanie.._480x480.webp?v=1710830530" alt="мурсалски чай описание" style="margin-bottom: 16px; float: none;"></div>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Известен под името Българската виагра, този представител на родната ни флора и билкова аптека се счита за мощен афродизиак.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Според народната медицина, тази билка увеличава сексуалното желание, половата мощ и фертилитета.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това растение притежава мощни антиоксидантни свойства и помага на организма ни в борбата с оксидативния стрес. Вероятно именно това действие е отговорно за силните му адаптогенни свойства.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Счита се, без да са налични сигнификантни литературни доказателства, че билката понижава нивата на кортизола- хормона на&nbsp; стреса и има благоприятно влияние върху глюкозния метаболизъм.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалския чай е наричан още Родопско чудо и се употребява в планинските райони на България почти като панацея.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Енергизира тялото и духа и помага за възстановителните процеси в организма.</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на магарешкия бодил:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/magareshki-bodil_480x480.webp?v=1705044207" alt="магарешки бодил действие"></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това е двугодишно растение, което вероятно всеки от нас е виждал. Вирее по поляни, пасища и ливади. Предпочита директна слънчева светлина.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В народната медицина, това лечебно растение, се препоръчва за тонизиране и енергизиране на организма. Приема се при кашлица, синузити и бронхити, където показва добро секретолитично и отхрачващо действие.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Билката има общоукрепващо и имуностимулиращо действие, притежава диуретичен ефект и предпазва сърдечния мускул и бъбреците. Помага при артериална хипертония.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В бодибилдинг средите магарешкият бодил се счита за растение, което притежава анаболно действие и подпомагащо синтеза на протеини.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това действие се обяснява със съдържанието му на сапонини - растителни вещества, подобно да стероидите.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Подобрява възстановяването на мускулите след тренировка и ги подготвя за по-тежки натоварвания.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешкият бодил има възбуждащо действие върху централната нервна система като я подготвя за периоди на интензивни натоварвания.</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на зеления чай:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/zelen-chai-deistvie_480x480.webp?v=1705048298" alt="зелен чай действие"></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зеленият чай е растение, притежаващо редица ползи за човешкото здраве. Интересен факт за него е, че той е втората най-употребявана напитка след водата в цял свят.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Има много сортове зелен чай, но всички те се отличават със високото съдържание на полифенолни съединения, флавоноиди, катехини и кофеин.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зеленият чай е мощен антиоксидант и детоксикиращ агент.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Участва активно в борбата със свободните радикали и оксидативния стрес.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Наличието на кофеин в него допринася за стимулаторното му въздействие върху нервната система, като повишава фокуса преди физически натоварвания.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Има силен енергизиращ ефект, като освен това катехините в него имат термогенно действие. Повишава метаболизма и мобилизира липидните и гликогенни запаси към митохондриите, където да бъдат разградени и преобразувани в енергия.</span></p>
// <h2><span style="font-weight: 400;">GMP сертификат&nbsp;</span></h2>
// <p><span>Дози в опаковката: 100.</span><span style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589" alt="gmp prime workout"></span></p>
// <h2>Състав&nbsp;</h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Единична доза: 1 капсула.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съдържание в единична доза – 1 капсула (1100 мг.):</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Аргинин AKG – 388,5 мг. (35%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-Карнитин тартрат – 333 мг. (30%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзея корен екстракт – 111 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирски Женшен екстракт – 111 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалски чай екстракт – 55,5 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешки бодил екстракт – 55,5 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зелен чай екстракт – 55,5 мг. (5%)</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Дневна доза: 2 капсули</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съдържание в дневна доза – 2 капсули (2200 мг.):</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Аргинин AKG – 777 мг. (35%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-Карнитин тартрат – 666 мг. (30%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзея корен екстракт – 222 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирски Женшен екстракт – 222 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалски чай екстракт – 111 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешки бодил екстракт – 111 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зелен чай екстракт – 111 мг. (5%)</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Начин на приемане:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-na-priem-hranitelna-dobavka_480x480.webp?v=1704896462" alt="начин на прием prime workout"></span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Препоръчителен дневен прием:&nbsp;</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Една капсула сутрин на гладно или 1 час преди тренировка.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">За активно спортуващи или професионални атлети: Може да се приемат по 2 капсули 1 час преди тренировка.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Препоръчителен период на прием: За максимални резултати е добре да се приема до 3 месеца (12 седмици). След период на почивка от около 2 седмици, цикълът може да се повтори.</span></p>
// <h2><span style="font-weight: 400;">За кого е подходящ:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Продуктът “Prime Workout”&nbsp; е подходящ за приемане от всеки, който извършва интензивни физически натоварвания и е превърнал спорта и състезанието със собствените си възможности в начин на живот.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Подходящ е както за стимулиране на фокуса и силата на ума, така и за оптимизиране на процесите, протичащи в мускулите по време на тренировки.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ползи от този продукт биха имали и хора, които имат твърде динамичен и стресиращ начин на живота, извършващи умствена работа или подложени на голям психо-емоционален стрес.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><b>Доверието на нашите клиенти е важно за нас. Поради това всеки продукт разполага с регистрационен номер, издаден от Агенцията, отговорна за контрола над храните и хранителни добавки, с който се верифицира неговата автентичност и качество: <span>Т032400081</span></b></span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Заключение:</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-zakluchenie._480x480.webp?v=1704974177" alt="заключение prime workout"></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Продуктът ‘’PrimeWorkout”&nbsp; е иновативен по своето съдържание, защото комбинира ефектите на две важни за тялото ни и тренировъчния процес аминокиселини с адаптогенни билки.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Резултатът, който “PrimeWorkout” ’ ще ни помогне да постигнем е да ни даде нужната концентрация, за да подобрим постиженията ни в спорта и всеки път да бъдем по-добри от предходния.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В комбинация с подобрената мотивация, приемът му ще засили темповете на нужните за възстановяването ни анаболни процеси и ще оптимизира елиминирането на токсините от мускулите.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Този продукт не е типичната предтренировъчна добавка, която е пренасита от стимуланти, които да натоварят допълнително нашата нервна система. Ние вярваме в постоянството и в системните резултати, стъпка по стъпка.&nbsp;</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Затова енергията, която ще ви даде “PrimeWokout” ще бъде плавна и постоянна, без пикове и спадове и ще държи нашата нервна система в кондиция, за да може бързо да се възстановим между отделните натоварвания и да бъдем все по-ефективни.</span></p>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Често задавани въпроси?</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243" alt="въпроси prime workout"></span></p>
// <p>Здравословно ли е да се приемат предтренировъчни продукти, какъвто е "Prime Workout" ? :</p>
// <p>Редица компании, в състава на своите предтренировъчни продукти, залагат основно на високото съдържание на кофеин и други стимуланти. В големи дози, те повишават нивата на стресовите хормони и водят до високо кръвно налягане и сърцебиене, както и тревожност и изпотяване.</p>
// <p>В нашия продукт, наличието на стимуланти (кофеин) е с изцяло естествен произход ( съдържа се в зеления чай) в дози, които са напълно безопасни. Освен това съдържанието на адаптогенни билки и натурални съставки, правят " Prime Workout" здравословен продукт, подходящ както за спортисти, така и за хора, които имат динамично ежедневие.</p>
// <p>Може ли да приемам "Pre Workout" след хранене? :</p>
// <p>Pre Workout, макар и по-различен от тези на конкурентните, е добре да се приема на гладно преди тренировка. Ако все пак приемате продукта след хранене, за да усетите ползите от него ще отнеме повече време, поради предимно билковата природа на продукта. По този начин вие няма да може да се възползвате от непосредствения ефект, който имат някои от съставките.</p>
  


//   </div>`;

  const htmlStringWithoutUneccesaryStyles = sanitizeHtmlString(htmlString);

  const headings = jsDomParser(htmlStringWithoutUneccesaryStyles);

  const lisWithHrefTags = createHrefTags(headings);

  const nestedTags = nestHTags(lisWithHrefTags);

 const toc = {
  tocHtml : nestedTags,
  tocJson : lisWithHrefTags
 }
 return toc
}

