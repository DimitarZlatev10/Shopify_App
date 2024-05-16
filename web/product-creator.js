import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import jsDomParser from "./html-h-tag-parser.js";
import sanitizeHtmlString from "./sanitizehtml.js";
import removeSpanElements from "./remove-span-tags.js";
import fixMistakesAndAddIds from "./text-error-fixer.js";
import generateTableOfContents from "./table-of-contents-generator.js";
import createToc from "./toc.js";
import createProductDescription from "./product-description.js";

const ADJECTIVES = [
  "autumn",
  "hidden",
  "bitter",
  "misty",
  "silent",
  "empty",
  "dry",
  "dark",
  "summer",
  "icy",
  "delicate",
  "quiet",
  "white",
  "cool",
  "spring",
  "winter",
  "patient",
  "twilight",
  "dawn",
  "crimson",
  "wispy",
  "weathered",
  "blue",
  "billowing",
  "broken",
  "cold",
  "damp",
  "falling",
  "frosty",
  "green",
  "long",
];

const NOUNS = [
  "waterfall",
  "river",
  "breeze",
  "moon",
  "rain",
  "wind",
  "sea",
  "morning",
  "snow",
  "lake",
  "sunset",
  "pine",
  "shadow",
  "leaf",
  "dawn",
  "glitter",
  "forest",
  "hill",
  "cloud",
  "meadow",
  "sun",
  "glade",
  "bird",
  "brook",
  "butterfly",
  "bush",
  "dew",
  "dust",
  "field",
  "fire",
  "flower",
];

export const DEFAULT_PRODUCTS_COUNT = 1;
const CREATE_PRODUCTS_MUTATION = `
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
      }
    }
  }
`;

const GET_ALL_PRODUCTS_QUERY = `
query shopInfo{
  products(first:10){
    edges{
      node{
        title
        id
        descriptionHtml
        metafields(first:1){
          edges{
            node{
              value
              namespace
              key
              id
            }
    }
  }
      }
    }
  }
}`;

export async function productCreator(session, count = DEFAULT_PRODUCTS_COUNT) {
  const client = new shopify.api.clients.Graphql({ session });

  console.log('wokerge');
  // 1.the html string

  //prime workout
    const htmlString = `<div class="prose prose-2xl text-black mx-auto mt-8 px-8 prose-img:rounded-xl">
  
    <p>PrimeWorkout</p>
  <p><span>Нашата формула е специално подбрана комбинация от натурални съставки, които ще подпомогнат вашата ефикасност по време на тренировъчния процес, както във&nbsp; физически, така и в психически аспект.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">За разлика от другите&nbsp; предтренировъчни продукти, приемът на Prime Workout ще ви осигури постоянни нива на енергия и концентрация и ще предостави условия за оптимално възстановяване на вашия организъм.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ефектите от приема на Prime Workout които ще усетите засягат различни аспекти от тренировчния процес и ще ви подготви за по-тежките последващи тренировки.</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"></span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Описание на Prime Workout:&nbsp;</span></h2>
  <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-opisanie-bilki._480x480.webp?v=1710773939" alt="описание на хранителна добавка prime workout" style="margin-bottom: 16px; float: none;"></div>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">“Prime Workout” представлява уникална по рода си формула, която съчетава в себе си две натурални аминокиселини и пет растения, които имат доказани качества за човешкото тяло.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Комбинацията е изключително интересна, поради това че адресира двата най-важни аспекта на всяка тренировка - физическия и нервно-психическия.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Същността на тренировъчния процес представлява да научим мозъкът и волята си да поставя все по-трудни препятствия пред нашето тяло и по този начин да подобряваме физическата си форма. Това ангажира изключително много нашата нервна система, както и скелетно-мускулния ни апарат.&nbsp;</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Поради това, възстановителните процеси трябва да са адекватни и реципрочни според натоварването.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Комбинацията от съставки в нашия продукт дава на тялото ни необходимото, за да може да даде всичко от себе си във физическия аспект, а също така бленда от адаптогенни и стимулиращи билки правят това възможно.&nbsp;</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">“PrimeWorkout” съдържа аминокиселината Аргинин и непротеиновата аминокиселина с витаминна природа Л-карнитин, както и няколко растения с доказан ефект :</span></p>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
  <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Аргинин AKG</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - има съдоразширяващ ефект, подпомага храненето на мускулите и допринася за “напомпващия ефект”</span>
  </li>
  </ul>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
  <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-Карнитин тартрат </span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">- аминокиселина с витаминна природа, отговорен за синтеза на енергия в клетките и повишава издръжливостта</span>
  </li>
  </ul>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
  <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзея корен екстракт</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - адаптогенна билка, за която се твърди, че повишава силата, мускулната маса и либидото при мъжа, както и протеиновия синтез</span>
  </li>
  </ul>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
  <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирски Женшен екстракт </span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">- адаптогенна билка, която подобрява концентрацията и нормализира нивата на стресовия хормон кортизол</span>
  </li>
  </ul>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
  <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалски чай екстракт </span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">- отново адаптогенна билка, известна като българската виагра. Повишава тонуса и чувството за сила, има качества на афродизиак.</span>
  </li>
  </ul>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
  <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешки бодил екстракт</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - притежава възбуждащ ефект върху нервната система и стимулира сърдечната дейност</span>
  </li>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;">
  <i><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зелен чай екстракт</span></i><span style="font-weight: 400;" data-mce-style="font-weight: 400;"> - енергетик, антиоксидант, притежава стимулиращо действие върху ЦНС.</span>
  </li>
  </ul>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Л- аргинин:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="действие на л аргинин тостесторен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/povishen-testosteron-vitaon....._480x480.webp?v=1707831794"></span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-аргинин е незаменима аминокиселина, която тялото ни не може да синтезира и си я набавя чрез храната, която поемаме.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-аргинин е прекурсор на азотния оксид. Тази молекула има редица роли в&nbsp; човешкото тяло. Отговаря за клетъчната сигнализация между клетките на имунната система и регулира имунния отговор.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той влиза в състава на протеините и участва в анаболните процеси</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Освен това е една от трите аминокиселини, от които се образува креатина. Креатинът, под неговата активна форма, креатин фосфат е енергоносеща молекула отговорна за синтеза на&nbsp; АТФ. Особено нужен е по време на физическо натоварване, където служи за отдаване на фосфатна група към молекулата на Аденозин дифосфат, превръщайки го в АТФ.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Азотният окис, освен като клетъчен сигнализатор, изпълнява ролята и на мощен вазодилататор - това означава, че той има способността да разширява кръвоносните съдове. По този начин се осъществява повишаване на кръвотока в скелетната мускулатура, което води до:</span></p>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="font-weight: 400;" data-mce-style="font-weight: 400;">засилен транспорт на глюкоза и аминокиселини в мускулните клетки, подпомагайки анаболитните и възстановителните процеси</span></li>
  </ul>
  <ul>
  <li style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="font-weight: 400;" data-mce-style="font-weight: 400;">повишено активно отделяне на токсични продукти от мускулните клетки, които са отговорни за мускулната умора и намаляване на силата, а именно млечната киселина.</span></li>
  </ul>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В резултат имаме по-здрави, по-издръжливи и по-силни мускули, които могат да преодоляват по-тежки и интензивни натоварвания.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="primeworkout infografika" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout_480x480.webp?v=1702302790"></span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ползите от приема на Л-аргинин не свършват дотук.&nbsp;</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съществуват проучвания, които доказват, че приемът на аминокиселината през устата може да доведе до повишение в серумните нива на хормона на растежа до 100%. В същото проучване, нивата на хормон на растежа при физически натоварвания, съчетани с прием на Л-аргинин, може да се повиши от 300 до 500%.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това са статистически значими следствия от приема на аминокиселината. Хормонът на растежа е отговорен за мускулния растеж, метаболизма на хранителни вещества. Повишените стойности около физически стимули води до подобряване на спортните постижения, нарастване на мускулната маса и по-добро възстановяване.</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Л-карнитин:</span></h2>
  <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="prime workout за енергия" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/hranitelni-dobavki-za-energiya._480x480.webp?v=1710772211"></div>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-карнитин е вещество с аминокиселинна природа, което не се включва в състава на белтъчините. По същество представлява витамин.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той е условно незаменим, което ще рече, че освен при определени условия, нуждите на организма ни от Л-карнитин, никога не превъзхождат способността на тялото ни да го синтезира.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Разбира се, това не означава, че допълнителния&nbsp; му прием е излишен.&nbsp;</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">За да извлечем ползите от него, свързани със спорта ни трябват по-големи количества, които да повишават концентрацията му в плазмата. Това не може да се случи, ако оставим на организмът ни сам да го произведе.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Основната роля на това вещество е&nbsp; да участва в процесите, свързани с обмен на енергия и по-скоро изгарянето на енергия.&nbsp;</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той служи като транспорт на мастните киселини до митохондриите, където се подлагат на процес на окисление и се разграждат до лесно усвоима енергия.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Особено ефективен е върху физическото представяне при хора, практикуващи спортове, свързани с издръжливост - бягане, плуване, колоездене.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Подобрява мускулната издръжливост при аеробни натоварвания; ускорява метаболизма.</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на левзеята:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="стрес напрежение левзея" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/stres-naprejenie-vitaon.._480x480.webp?v=1707830065"></span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзеята е адаптогенна билка, разпространена най-вече в Сибир, Северна Русия и Казахстан. Коренът и е богат на активни вторични метаболити. Най-известните са от групата на сапонините - бета-екдистерона.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">На него дължим ефектите на билката върху тялото ни. Те са разнообразни - помага ни да се справяме със стреса, както физическия, така и психо-емоционалния.&nbsp;</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Освен това Левзеята е мощен афродизиак и се счита, че подобрява половата мощ.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Липсват убедителни проучвания, но все пак съществуват данни,че приемът и води до нарастване на мускулната маса, увеличаване на анаболния синтез, както и подобряване на силовата издръжливост.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзеята съдържа в себе си вторични метаболити, които имат изразени антиоксидантни свойства и допринасят за деактивирането на свободните радикали, които са плод от мускулния метаболизъм.</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Сибирския Женшен:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="сибирски жен шен корен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/jen-shen-koren_480x480.webp?v=1705048986"></span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирският Женшен е лечебно растение, чиито качества са световно известни и признати.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той е богат на активни вторични метаболити, които участват в редица процеси, извършвани в човешкото тяло. Те са причината за полезните свойства на билката върху организма ни.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Счита се, че Сибирския Женшен е мощен адаптоген. Помага при справяне със стресови ситуации и потиска нивата на кортизола.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Регулира енергийните нива и ги разпределя правилно, за да може да подсигури плавен приток на енергия, без пикове и спадове, както е характерно за стимулантите.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Той притежава силно антиоксидантно действие и помага за детоксикиране на тялото, както и за подобряване на средата за извършване на физиологични процеси.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съществуват данни, че тази билка играе роля в хомеостазата на половите хормони, като приемът му води до повишаване на нивата на свободния тестостерон.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Женшенът помага на организма ни да работи в екстремни условия. Той има положително влияние върху централната нервна система. Регулира настроението и фокуса, подобрява когнитивните способности.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ефективен е за употреба от спортисти, повишава мускулната издръжливост и подобрява притока на кръв към мозъка и към крайниците ни.</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на Мурсалския чай:</span></h2>
  <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/mursalski-chai-opisanie.._480x480.webp?v=1710830530" alt="мурсалски чай описание" style="margin-bottom: 16px; float: none;"></div>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Известен под името Българската виагра, този представител на родната ни флора и билкова аптека се счита за мощен афродизиак.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Според народната медицина, тази билка увеличава сексуалното желание, половата мощ и фертилитета.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това растение притежава мощни антиоксидантни свойства и помага на организма ни в борбата с оксидативния стрес. Вероятно именно това действие е отговорно за силните му адаптогенни свойства.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Счита се, без да са налични сигнификантни литературни доказателства, че билката понижава нивата на кортизола- хормона на&nbsp; стреса и има благоприятно влияние върху глюкозния метаболизъм.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалския чай е наричан още Родопско чудо и се употребява в планинските райони на България почти като панацея.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Енергизира тялото и духа и помага за възстановителните процеси в организма.</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на магарешкия бодил:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/magareshki-bodil_480x480.webp?v=1705044207" alt="магарешки бодил действие"></span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това е двугодишно растение, което вероятно всеки от нас е виждал. Вирее по поляни, пасища и ливади. Предпочита директна слънчева светлина.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В народната медицина, това лечебно растение, се препоръчва за тонизиране и енергизиране на организма. Приема се при кашлица, синузити и бронхити, където показва добро секретолитично и отхрачващо действие.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Билката има общоукрепващо и имуностимулиращо действие, притежава диуретичен ефект и предпазва сърдечния мускул и бъбреците. Помага при артериална хипертония.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В бодибилдинг средите магарешкият бодил се счита за растение, което притежава анаболно действие и подпомагащо синтеза на протеини.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Това действие се обяснява със съдържанието му на сапонини - растителни вещества, подобно да стероидите.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Подобрява възстановяването на мускулите след тренировка и ги подготвя за по-тежки натоварвания.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешкият бодил има възбуждащо действие върху централната нервна система като я подготвя за периоди на интензивни натоварвания.</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Действие на зеления чай:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/zelen-chai-deistvie_480x480.webp?v=1705048298" alt="зелен чай действие"></span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зеленият чай е растение, притежаващо редица ползи за човешкото здраве. Интересен факт за него е, че той е втората най-употребявана напитка след водата в цял свят.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Има много сортове зелен чай, но всички те се отличават със високото съдържание на полифенолни съединения, флавоноиди, катехини и кофеин.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зеленият чай е мощен антиоксидант и детоксикиращ агент.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Участва активно в борбата със свободните радикали и оксидативния стрес.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Наличието на кофеин в него допринася за стимулаторното му въздействие върху нервната система, като повишава фокуса преди физически натоварвания.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Има силен енергизиращ ефект, като освен това катехините в него имат термогенно действие. Повишава метаболизма и мобилизира липидните и гликогенни запаси към митохондриите, където да бъдат разградени и преобразувани в енергия.</span></p>
  <h2><span style="font-weight: 400;">GMP сертификат&nbsp;</span></h2>
  <p><span>Дози в опаковката: 100.</span><span style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589" alt="gmp prime workout"></span></p>
  <h2>Състав&nbsp;</h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Единична доза: 1 капсула.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съдържание в единична доза – 1 капсула (1100 мг.):</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Аргинин AKG – 388,5 мг. (35%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-Карнитин тартрат – 333 мг. (30%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзея корен екстракт – 111 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирски Женшен екстракт – 111 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалски чай екстракт – 55,5 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешки бодил екстракт – 55,5 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зелен чай екстракт – 55,5 мг. (5%)</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Дневна доза: 2 капсули</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Съдържание в дневна доза – 2 капсули (2200 мг.):</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Аргинин AKG – 777 мг. (35%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Л-Карнитин тартрат – 666 мг. (30%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Левзея корен екстракт – 222 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Сибирски Женшен екстракт – 222 мг. (10%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Мурсалски чай екстракт – 111 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Магарешки бодил екстракт – 111 мг. (5%)</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><br></span><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Зелен чай екстракт – 111 мг. (5%)</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Начин на приемане:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-na-priem-hranitelna-dobavka_480x480.webp?v=1704896462" alt="начин на прием prime workout"></span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Препоръчителен дневен прием:&nbsp;</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Една капсула сутрин на гладно или 1 час преди тренировка.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">За активно спортуващи или професионални атлети: Може да се приемат по 2 капсули 1 час преди тренировка.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Препоръчителен период на прием: За максимални резултати е добре да се приема до 3 месеца (12 седмици). След период на почивка от около 2 седмици, цикълът може да се повтори.</span></p>
  <h2><span style="font-weight: 400;">За кого е подходящ:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Продуктът “Prime Workout”&nbsp; е подходящ за приемане от всеки, който извършва интензивни физически натоварвания и е превърнал спорта и състезанието със собствените си възможности в начин на живот.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Подходящ е както за стимулиране на фокуса и силата на ума, така и за оптимизиране на процесите, протичащи в мускулите по време на тренировки.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Ползи от този продукт биха имали и хора, които имат твърде динамичен и стресиращ начин на живота, извършващи умствена работа или подложени на голям психо-емоционален стрес.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><b>Доверието на нашите клиенти е важно за нас. Поради това всеки продукт разполага с регистрационен номер, издаден от Агенцията, отговорна за контрола над храните и хранителни добавки, с който се верифицира неговата автентичност и качество: <span>Т032400081</span></b></span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Заключение:</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-zakluchenie._480x480.webp?v=1704974177" alt="заключение prime workout"></span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Продуктът ‘’PrimeWorkout”&nbsp; е иновативен по своето съдържание, защото комбинира ефектите на две важни за тялото ни и тренировъчния процес аминокиселини с адаптогенни билки.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Резултатът, който “PrimeWorkout” ’ ще ни помогне да постигнем е да ни даде нужната концентрация, за да подобрим постиженията ни в спорта и всеки път да бъдем по-добри от предходния.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">В комбинация с подобрената мотивация, приемът му ще засили темповете на нужните за възстановяването ни анаболни процеси и ще оптимизира елиминирането на токсините от мускулите.</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Този продукт не е типичната предтренировъчна добавка, която е пренасита от стимуланти, които да натоварят допълнително нашата нервна система. Ние вярваме в постоянството и в системните резултати, стъпка по стъпка.&nbsp;</span></p>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Затова енергията, която ще ви даде “PrimeWokout” ще бъде плавна и постоянна, без пикове и спадове и ще държи нашата нервна система в кондиция, за да може бързо да се възстановим между отделните натоварвания и да бъдем все по-ефективни.</span></p>
  <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;">Често задавани въпроси?</span></h2>
  <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243" alt="въпроси prime workout"></span></p>
  <p>Здравословно ли е да се приемат предтренировъчни продукти, какъвто е "Prime Workout" ? :</p>
  <p>Редица компании, в състава на своите предтренировъчни продукти, залагат основно на високото съдържание на кофеин и други стимуланти. В големи дози, те повишават нивата на стресовите хормони и водят до високо кръвно налягане и сърцебиене, както и тревожност и изпотяване.</p>
  <p>В нашия продукт, наличието на стимуланти (кофеин) е с изцяло естествен произход ( съдържа се в зеления чай) в дози, които са напълно безопасни. Освен това съдържанието на адаптогенни билки и натурални съставки, правят " Prime Workout" здравословен продукт, подходящ както за спортисти, така и за хора, които имат динамично ежедневие.</p>
  <p>Може ли да приемам "Pre Workout" след хранене? :</p>
  <p>Pre Workout, макар и по-различен от тези на конкурентните, е добре да се приема на гладно преди тренировка. Ако все пак приемате продукта след хранене, за да усетите ползите от него ще отнеме повече време, поради предимно билковата природа на продукта. По този начин вие няма да може да се възползвате от непосредствения ефект, който имат някои от съставките.</p>
    
  
  
    </div>`

  //melatonin spray
//   const htmlString = `<div class="prose prose-2xl text-black mx-auto mt-8 px-8 prose-img:rounded-xl">
  
//   <p dir="ltr"><span>Мелатонин спрей представлява натурално помощно средство, съдържащо в себе си <strong>"</strong></span><strong>хормона на съня</strong><span><strong>"</strong> и екстракти от </span><strong>билките мента и валериана</strong><span> под формата на спрей за впръскване под езика. Комбинацията от трите съставки действа благоприятно на човешкия организъм и в синергизъм една с друга, като има благоприятен ефект за постигане на спокоен и качествен сън.</span></p>
// <h2 dir="ltr"><span>Съдържание на продукта</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_480x480.webp?v=1701767331" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_480x480.webp?v=1701767331"></span></span></span></span></p>
// <p dir="ltr"><span><strong>Основни съставки</strong>: </span><span>Съставки: Мента (Mentha) екстракт, валериан (Valeriana officinalis) екстракт, мелатонин, пречистена вода, етанол.</span></p>
// <ul>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Едно впръскване: 0,3 ml</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Количество: 30 ml</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Опаковка за: 100 дни</span></p>
// </li>
// </ul>
// <p dir="ltr"><span>В едно впръскване – водно-етанолов екстракт (16%):</span></p>
// <ul>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Мелатонин – 1 mg</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Мента екстракт – 4 mg</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Валериан екстракт – 2 mg</span></p>
// </li>
// </ul>
// <p dir="ltr"><strong>Предлагаме чиста и естествена подкрепа за вашето здраве:</strong></p>
// <ul>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>100% активни съставки</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Вегетарианска формула</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Без глутен</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Без лактоза</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Без добавена захар</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Без консерванти и изкуствени оцветители</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Не е тестван върху животни.</span></p>
// </li>
// </ul>
// <h2 dir="ltr"><span>Препоръки за прием</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="начина на прием мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-napriem-melatonin-sprei_480x480.webp?v=1708507127" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-napriem-melatonin-sprei_480x480.webp?v=1708507127"></span></span></p>
// <h3 dir="ltr"><span>Препоръчителен дневен прием</span></h3>
// <p dir="ltr"><span>Впръскайте еднократно под езика, веднъж дневно – вечер 30 минути преди сън.&nbsp;</span></p>
// <h3 dir="ltr"><span>Препоръчителен период на прием</span></h3>
// <ul>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Приемайте този продукт при нужда.&nbsp;</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Непрекъснатият прием води до бързо привикване.</span></p>
// </li>
// </ul>
// <h3 dir="ltr"><span>Други препоръки:</span></h3>
// <ul>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Само за перорално приложение.&nbsp;</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Да не се превишава препоръчителната дневна доза.</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Да не се приема от бременни и кърмещи жени.</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Продуктът не е заместител на разнообразното хранене.</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Продуктът не е лекарствено средство, а хранителна добавка.</span></p>
// </li>
// <li aria-level="1" dir="ltr">
// <p role="presentation" dir="ltr"><span>Консултирайте се с вашия личен лекар преди прием.</span></p>
// </li>
// </ul>
// <h2 dir="ltr"><span>За кого е подходящ?</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей при безсъние" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011"></span></span></p>
// <p dir="ltr"><span>Продуктът е подходящ за всеки човек, който има </span><strong>затруднения при заспиване </strong><span>или </span><strong>неспокоен сън</strong><span>.</span></p>
// <p dir="ltr"><span>Също така е добър избор за хора, които имат ограничено време за сън - така ще осигурят<strong> </strong></span><span><strong>по-бързо заспиване</strong> </span><span>и навлизане в REM-фазите на съня, където се осъществяват съвършените регенераторни процеси.</span></p>
// <p dir="ltr"><span>Има общоукрепващо, успокояващо и леко седативно действие. Проявява антиоксидантно действие, както и протективен ефект върху централната нервна система (ЦНС).</span></p>
// <p dir="ltr"><span>Профилактира различни нервно-дегенеративни заболявания и е добър избор за допълнително лечение при хора в начални фази на болестта на Алцхаймер и деменция.</span></p>
// <p dir="ltr"><span>Доверието на нашите клиенти е важно за нас. Поради това всеки продукт разполага с регистрационен номер, издаден от Агенцията, отговорна за контрола над храните и хранителни добавки, с който се верифицира неговата автентичност и качество: Т032304821</span></p>
// <h2 dir="ltr">
// <span>GMP сертификат</span><span></span>
// </h2>
// <h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="GMP сертификат" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589"></span></h2>
// <p dir="ltr"><span>GMP сертификат - Добрата производствена практика - представлява златния стандарт в </span><strong>производството на хранителни добавки.&nbsp;</strong></p>
// <p dir="ltr"><span>Продуктите на VitaОn се произвеждат, спазвайки стриктно производствените процеси и налагайки строг контрол във всеки етап, гарантирайки високо качество и безопасност.&nbsp;</span></p>
// <p dir="ltr"><span>GMP сертификатите са своеобразно доказателство за отдадеността на компанията ни, да ви предоставя само първокласни </span><strong>премиум продукти.&nbsp;</strong></p>
// <p dir="ltr"><span>Ние поставяме като приоритети постоянството, точността и чистотата и по този начин ви предлагаме спокойствие и доверие, за които носим отговорност.</span></p>
// <h2 dir="ltr"><span>Какво е мелатонин?</span></h2>
// <p dir="ltr"><span>Мелатонинът, или както е известен още <strong>“</strong></span><strong>хормонът на съня</strong><span><strong>”</strong>, е вещество, което по своята химична природа представлява индоламин. Индоламините са група от сходни съединения, изпълняващи ролята на невротрансмитери в ЦНС.</span></p>
// <p dir="ltr"><span>Мелатонинът при гръбначните животни, в това число и хората, изпълнява основната функция на </span><strong>регулатор на съня</strong><span><strong> </strong>и бодърстването. Отговорен е още за регулиране на кръвното налягане и ритмичните сезонни промени при животните.</span></p>
// <p dir="ltr"><span>Упражнява по-голямата част от своите функции чрез активиране на специфични за него рецептори, а други - чрез своята роля на антиоксидант.&nbsp;</span></p>
// <p dir="ltr"><span>Мелатонинът е естествен невротрансмитер и хормон, който тялото ни произвежда.&nbsp;</span></p>
// <p dir="ltr"><span>Симптомите на дефицит са свързани с </span><strong>нарушения в съня</strong><span> и циркадния ритъм. Наблюдават се най-често при хора, работещи на смени, при които е нарушен естественият биологичен часовник. Срещат се често и при възрастните хора.&nbsp;</span></p>
// <p dir="ltr"><span>В случай на недостиг, мелатонинът се приема като</span><span> <strong>хранителна добавка</strong> </span><span>под формата на таблетки, капки или спрей.</span></p>
// <h2 dir="ltr"><span>Интересни факти за мелатонина</span></h2>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="факти за мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/psihichno-zdrave._480x480.webp?v=1704461972"></div>
// <p dir="ltr"><span>Произходът на думата мелатонин има гръцки корени и означава “мелас” - черен и “тонос”- потискам.&nbsp;</span></p>
// <p dir="ltr"><span>Мелатонинът получава това име във връзка с механизма си на действие, чрез което е открит за първи път. През 1917 година, учените К. П. МакКорд и Ф. П. Алън откриват, че захранването на попови лъжички с екстракт от епифизна жлеза на говеда води до изсветляване на цвета им чрез контрациране на тъмните епидермални меланофори.</span></p>
// <p dir="ltr"><span>Ефектът да “избелва” кожата е доказан и при хората, а по-късно е установен и връзката му при</span><span> <strong>регулиране на циркадния ритъм</strong></span><strong>.</strong></p>
// <p dir="ltr"><span>Мелатонинът е светлинно зависим хормон. Той се произвежда през нощта, когато няма източници на светлина, в малка ендокринна жлеза, наречена </span><strong>епифиза</strong><span><strong>.</strong> Тя е разположена в централната част на мозъка, но извън кръвно-мозъчната бариера.</span></p>
// <p dir="ltr"><span>Производството на този хормон става под контрола на супрахиазматичните ядра, които получават информация за </span><strong>светлина/мрак</strong><span><strong> </strong>от ретиналните фоточувствителни ганглийни клетки. Те са разположени в окото.</span></p>
// <p dir="ltr"><span>Мелатонинът стимулира активността на нощните животни, докато при дневно-активните </span><strong>стимулира съня</strong><span> и процеса на заспиване.</span></p>
// <p dir="ltr"><span>В животинското царство, мелатонинът оказва влияние върху размножителните периоди и хормоналните промени, които настъпват през това време. Стимулират или потискат либидото, регулират смяната на козината и други.</span></p>
// <p dir="ltr"><span>При хората, мелатонинът контролира обмяната на веществата чрез понижаване на лептина </span><strong>през нощта.</strong></p>
// <h2 dir="ltr"><span>Биологичен синтез</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="приложение на валериана в мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-prilojenie._480x480.webp?v=1708508396" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-prilojenie._480x480.webp?v=1708508396"></span></span></p>
// <p dir="ltr"><span>Процесът на </span><span><strong>производство на мелатонин</strong> </span><span>включва поредица от биохимични реакции.&nbsp;</span></p>
// <p dir="ltr"><span>Основен прекурсор на мелатонина, както и на други невротрансмитери (серотонин и други), е аминокиселината L-триптофан. Тази аминокиселина е незаменима за човешкия организъм и ние се сдобиваме с нея чрез храната при процеса на белтъчното разграждане.</span></p>
// <p dir="ltr"><span>След това, индоловият пръстен в строежа на триптофана претърпява процес на хидроксилиране от ензим, наречен триптофан хидроксилаза, като се получава 5-хидрокситриптофан (5- HTP). 5-HTP е прекурсор както на мелатонин, така и серотонин.</span></p>
// <p dir="ltr"><span>5-HTP след това е подложен на декарбоксилация от пиридоксал фосфат и 5-хидрокситриптофан декарбоксилаза до получаване на серотонин.</span></p>
// <p dir="ltr"><span>В зависимост от периода на </span><span><strong>денонощието</strong> </span><span>и нуждите на организма, серотининът може да започне да изпълнява специфичните си нужди или да се превърне в N-ацетилсеротонин с помощта на серотонин N- ацетилтрансфераза и ацетил-КоА.</span></p>
// <p dir="ltr"><span>След претърпяване на процес на метилация на хидроксилната група на ацетилсеротонина от хидроксииндол О-метилтрансферазата и S-аденозил метионин, той се превръща в мелатонин.</span></p>
// <p dir="ltr"><span>Химическото наименование на мелатонина е</span><span> <strong>N-ацетил- 5-метокситриптамин</strong></span><strong>.</strong></p>
// <h2 dir="ltr"><span>Регулация и ритмичност в отделянето на мелатонин</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей при безсъние" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011"></span></span></p>
// <p dir="ltr"><span>Отделянето на мелатонин е ритмичен процес, свързан с </span><strong>бодърстването и съня</strong><span>, деня и нощта.</span></p>
// <p dir="ltr"><span>Представлява изцяло хормонален сигнал, обусловен от наличието на светлина и независим от поведенчески фактори. Регулира се от отделянето на норепинефрин от симпатиковите нервни влакна единствено през нощта.</span></p>
// <p dir="ltr"><span>Норепинефринът повишава нивата на цикличния аденозин монофосфат (cAMP) посредством бета-адренергични рецептори и активира ензим, наречен cAMP-зависима протеин киназа А. Този биохимичен път е решаващ за регулацията на ензима арилалкаламин-N-ацетилтрансферазата (ААNAT), който е от голямо значение за </span><strong>синтеза на мелатонин</strong><span>.</span></p>
// <p dir="ltr"><span>През деня, при наличието на светлинен стимул и липса на норепинефринна стимулация, този протеин бързо се разрушава от протеозомални протеази и по този начин синтезът на мелатонин се инхибира.</span></p>
// <p dir="ltr"><span>През нощта повишаването на норадреналина води до натрупване на cAMP, което от своя страна увеличава синтеза на AANAT и сигнализира на епифизната ни жлеза да започне </span><strong>отделянето на мелатонин</strong><span>. Този процес се инхибира от наличието на светлина.</span></p>
// <h2 dir="ltr"><span>Ползи от мелатонина за човешкия организъм&nbsp;</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей инфографика" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_sprei_infografika_480x480.webp?v=1702624787" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_sprei_infografika_480x480.webp?v=1702624787"></span></span></p>
// <p dir="ltr"><span>Основната </span><span><strong>функция на мелатонина</strong> </span><span>е регулацията на циркадния ритъм и режима бодърстване-сън чрез редица сложни биохимични и биофизични реакции.</span></p>
// <p dir="ltr"><span>При новородените, нивата на мелатонин се нормализират и стават постоянни до към тримесечна възраст, като са най-високи от полунощ до 8 часа сутринта.</span></p>
// <p dir="ltr"><span>С навлизането в тийнейджърските години, отделянето на мелатонин започва по-късно вечерта, което води до по-късно заспиване и по-продължителен сън.</span></p>
// <p dir="ltr"><span>Напредването на възрастта има обратно-пропорционална зависимост с процесите на </span><strong>мелатонинова секреция</strong><span>. Възрастните хора отделят малки количества от този хормон, затова и обикновено прекарват много по-малко време в сън.</span></p>
// <p dir="ltr"><span>Клинични проучвания доказват, че при хора с намалено производство или заболявания, при които се наблюдава </span><strong>дефицит на мелатонина</strong><span>, има полза от приема му под формата на хранителна добавка като таблетки, капсули или спрей.</span></p>
// <h3 dir="ltr"><span>Ползи от мелатонина като антиоксидант</span></h3>
// <p><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/antioksidantno-deistvie-bilki._480x480.webp?v=1710831875" alt="мелатонин спрей антиоксидант от витаон" style="margin-bottom: 16px; float: none;" data-mce-style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/antioksidantno-deistvie-bilki._480x480.webp?v=1710831875"></span></p>
// <p dir="ltr"><span>Мелатонинът притежава функцията на мощен антиоксидант. Тази негова функция е доказана през 1993 година.</span></p>
// <p dir="ltr"><span>Той участва активно при неутрализирането на свободни кислородни и азотни радикали, като също доказано води до повишаване активността на редица антиоксидантни ензими.</span></p>
// <p dir="ltr"><strong>Антиоксидантните качества на мелатонина</strong><span> го правят добър в протекцията срещу липидната оксидация, като стабилизира биологичните мембрани. Ефективен е срещу действието на йонизиращата радиация, отравяне с тежки метали и неутрализиране на отпадни продукти от метаболизма на лекарствени препарати.</span></p>
// <p dir="ltr"><span>Доказано е, че този хормон предпазва ДНК от оксидативния стрес, както и клетъчните протеини.&nbsp;</span></p>
// <p dir="ltr"><span>При нарушаване на кода на ДНК в следствие силния оксидативен стрес започват да се произвеждат нефункционални протеини или такива с вредно действие. Следствие на това се повишава вероятността от появата на онкологични заболявания и аномалии.</span></p>
// <p dir="ltr"><span>Мелатонинът проявява способност да модулира редокс-чувствителни мишени, чиито структури и функции биват нарушавани дори при минимално изложение на оксидативен стрес, и реагира дори при действието на суб-оксидативни стимули.</span></p>
// <p dir="ltr"><span>Мелатонинът демонстрира синергистично действие с другите </span><strong>антиоксиданти</strong><span><strong> </strong>като витамин C, провитамин А и токофероли като витамин Е и полифенолни органични съединения.</span></p>
// <p dir="ltr"><span>Приемът на мелатонин се свързва с повишен антиоксидантен капацитет на плазмата. Няколко метаболита от </span><strong>обмяната на мелатонина</strong><span> също показват антиоксидантен потенциал.</span></p>
// <h3 dir="ltr"><span>Ползи от мелатонина против стареене</span></h3>
// <p><span><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей валериана анти ейдж" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-anti-age_480x480.webp?v=1708513347" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-anti-age_480x480.webp?v=1708513347"></span></p>
// <p dir="ltr"><span>Установено е, че с напредване на процесите на стареене, се наблюдават </span><strong>нарушения в синтеза на мелатонин</strong><span><strong>.</strong> Количествените и качествените промени са строго индивидуални, но намаляването на нивата на мелатонин и неговите метаболити се установяват предимно в конкретни области на тялото ни.</span></p>
// <p dir="ltr"><span>Спада в нивата му се свързва с различни невровегетативни заболявания, като например болестта на Алцхаймер и различните форми на старческа деменция. Те са следствие от нарушаване функционалността и структурата на супрахиазматичното ядро, нарушено невронално предаване в епифизата, както и формиране на калцификати в жлезата.&nbsp;</span></p>
// <p dir="ltr"><span>В заключение науката приема, че мелатонинът може да е от полза в лечението на патологични състояния, свързани със </span><strong>стареенето</strong><span><strong>.</strong> Добавянето му с цел компенсиране на настъпилите липси би могло да възстанови нормалната хомеостаза на организма.</span></p>
// <p dir="ltr"><span>Известно е още, че мелатонинът инхибира процесите на вътрешна апоптоза (клетъчна смърт), които са ускорени при невровегетативни заболявания като болест на Паркинсон, амиотрофична латерална склероза и други.</span></p>
// <p dir="ltr"><span>Ранното прилагане на</span><span> <strong>мелатонин при болестта</strong></span><span> на Алцхаймер едновременно намалява увредите, причинени от оксидативния стрес, и намалява акумулацията на амилоидни телца.</span></p>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="Мелатонин при болест алцхаймер" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-pri-alchaimer-i-parkinson_480x480.webp?v=1708068377"></div>
// <p dir="ltr"><span>При всички невродегенеративни заболявания се наблюдават поведенчески промени, които са следствие от невроналната увреда. </span><span><strong>Приемът на мелатонин</strong> </span><span>може да стабилизира тези състояния, като предпазва от настъпване на дисфункция на холинергичната система. В нея водещ невротрансмитер е ацетилхолинът.</span></p>
// <p dir="ltr"><span>При започната навреме терапия още в първите етапи от клиничната изява на болестта на Алцхаймер, този хормон може да забави нейното развитие и да намали симптоматиката.&nbsp;</span></p>
// <p dir="ltr"><span>По-голямата част от невропротективните свойства и </span><span><strong>anti-aging ефекта на мелатонина</strong> </span><span>се дължат на мощните антиоксидантни свойства на този индоламин. Те оказват благоприятен ефект при лечение на такъв тип заболявания на централната нервна система. Понижават степента на апоптозата, намаляват пероксидацията на мазнините, предизвикана от бета-амилоидния белтък и повишават капацитета на ДНК да се възстановява.</span></p>
// <h3 dir="ltr"><span>Ползи от мелатонина за черния дроб</span></h3>
// <p><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-za-cherniya-drob-vitaon._480x480.webp?v=1710851098" alt="мелатонин спрей предпазва черния дроб" style="margin-bottom: 16px; float: none;" data-mce-style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-za-cherniya-drob-vitaon._480x480.webp?v=1710851098"></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-e338a1dc-7fff-6185-7ffb-20405d2427b1"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Мелатонинът се съдържа в множество растителни видове, в които изпълнява различни функции. </span><strong>Ползите за човешкото тяло</strong><span> от неговия прием са доказани при редица състояния.</span></p>
// <p dir="ltr"><span>Интересен факт е, че въпреки че се нарича хормон на съня, мелатонинът се съдържа и в големи дози в кафето - напитка, която от векове се използва за </span><strong>справяне с умората</strong><span>, сънливостта и за повишаване на умствения и физическия капацитет на тялото.</span></p>
// <p dir="ltr"><span>Затова и някои хора съобщават, че след приема на кафе всъщност стават </span><strong>сънливи</strong><span>, вместо ободрени.</span></p>
// <p dir="ltr"><span>Приемът на кафе, благодарение на съдържанието му на мелатонин, както и други </span><a href="https://vitaon.bg/collections/antioksidanti" data-mce-href="https://vitaon.bg/collections/antioksidanti"><span>природни антиоксиданти</span></a><span>, оказва хепатопротективен ефект върху черния дроб. Тези ефекти са демонстрирани при чернодробни заболявания като фиброза, стеатохепатит и цироза, вследствие на отравяне с въглероден тетрахлорид.</span></p>
// <p dir="ltr"><span>Редица други проучвания потвърждават ползите от приема на този индоламин за запазване на </span><strong>чернодробната функция.</strong></p>
// <h3 dir="ltr"><span>Ползи от мелатонина за сърцето</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/kardiologichen-efekt_480x480.webp?v=1704799765" alt="сърдечно съдова система мелатонин спрей" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/kardiologichen-efekt_480x480.webp?v=1704799765"></span></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-a9e35a50-7fff-7fd6-f643-01cd9bc77cd2"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Позитивни ефекти от допълнителен прием на мелатонин или от повишени плазмени нива се наблюдават и върху </span><strong>сърдечно-съдовата система.</strong></p>
// <p dir="ltr"><span>Всеизвестен факт е, че приемът на червено вино има защитно действие при сърдечни заболявания. Една от причините е, че червеното вино инхибира </span><strong>мелатониновия рецептор</strong><span>, като по този начин увеличава концентрацията на свободноциркулиращия хормон в кръвта.</span></p>
// <p dir="ltr"><span>Приемът на </span><span><strong>мелатонин като добавка</strong> </span><span>или чрез храни води до редукция на хипертрофията на дясната камера, подобрена помпена функция и намалена сърдечна интерстициална фиброза.</span></p>
// <h3 dir="ltr"><span>Ползи от мелатонина като средство за борба с ракови клетки</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/protivorakovo-deistvie-bilkova-tinktura_480x480.webp?v=1708067786" alt="анти-раково действие валериана" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/protivorakovo-deistvie-bilkova-tinktura_480x480.webp?v=1708067786"></span></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-ec7acad3-7fff-9413-f48a-70cc9114f2d1"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Редица проучвания показват, че мелатонинът може да има роля като </span><strong>противораково средство</strong><span>. Доказана е обратнопропорционална връзка между някои онкологични заболявания и нивата на </span><span><strong>серумния мелатонин</strong> </span><span>и експресията на мелатониновия рецептор.</span></p>
// <p dir="ltr"><span>Антипролиферативната активност (т.е. възможността да потиска деленето на злокачествените клетки) е установена срещу няколко популации от туморни клетки.</span></p>
// <p dir="ltr"><strong>Тези популации включват:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Рак на гърдата</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Дебелочревен карцином</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Вагинален</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Ендометриален</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Белодробен</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Панкреатичен</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Простатен</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Бъбречен</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Тестикулярен и други.</span></p>
// </li>
// </ul>
// <p dir="ltr"><strong>Действието на мелатонина</strong><span> е свързано със способността му да намалява повредите на ДНК, да повишава активността на други антиоксидантни ензими и да регулира експресията на конкретни онкогени. В експериментални проучвания, този хормон работи синергистично с редица химиотерапевтици.</span></p>
// <p dir="ltr"><span><strong>Ролята на мелатонина</strong> </span><span>при превенция и профилактика на раковите заболявания е доказана косвено, като е установено, че честотата на някои специфични ракови заболявания е значително по-висока при определени групи от хора.&nbsp;</span></p>
// <p dir="ltr"><span>Сходното между всички тях е </span><span><strong>нарушеният циркаден ритъм</strong> </span><span>и излагането на светлина през нощта. По този начин </span><strong>биологичният ритъм</strong><span> на пикове и спадове в серумните нива на мелатонина е напълно объркан и той не може да изпълнява регулаторните си функции.&nbsp;</span></p>
// <p dir="ltr"><span><strong>Това е предпоставка за</strong>:</span></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Многократно повишен оксидативен стрес</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Нарушен имунологичен отговор към стресори</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Повишена пролиферация и намалена апоптоза на клетки с дефектирала ДНК- спирала и други.</span></p>
// </li>
// </ul>
// <h2 dir="ltr"><span>Мента (Mentha Piperita)</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-melatonin-sprei_480x480.webp?v=1708514605" alt="мелатонин спрей билка мента" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-melatonin-sprei_480x480.webp?v=1708514605"></span></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-eddc9d89-7fff-ae15-0b58-62973b6fe26e"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Ментата (mentha piperita) e зелено храстовидно растение, член на семейство Lamiaceae. Известно още като семейството на </span><strong>ментата</strong><span>, то включва голям брой ароматни билки, в това число босилек, розмарин, риган и джоджен.</span></p>
// <p dir="ltr"><span>Представлява ниско многогодишно растение, което има широк ареал на разпространение. Обича да обитава влажни и немного слънчеви места, най-често около реки, естествени и изкуствени водоеми.</span></p>
// <h3 dir="ltr"><span>Активни вещества на ментата</span></h3>
// <p dir="ltr"><span>Ментата представлява ароматна билка, която е известна с етеричните си масла. Те се извличат чрез алкохолна дестилация на листната маса на растението.</span></p>
// <p dir="ltr"><span>Периодът, в който се берат листата на билката с цел екстракция на ароматното масло, е в началото на фазата на цъфтежа. Тогава маслото е най-богато на </span><strong>активни вещества</strong><span>. </span><strong>Екстрактът от мента</strong><span> се стандартизира и по норматив трябва да съдържа не по-малко от 44% ментол, 15-30% ментон, 5% естери и множество терпеноиди.&nbsp;</span></p>
// <p dir="ltr"><strong>Съдържа още:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Флавоноиди (до 12%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Полифеноли</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Каротени</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Токоферол</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Холин</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Бетаин.&nbsp;</span></p>
// </li>
// </ul>
// <p dir="ltr"><span>Етеричното масло от мента съдържа терпеноидите алфа-пинин и бета-пинин, алфа- феландрен и също естери на оцетна и изовалерична киселина. Последните две съединения са отговорни за силното </span><strong>антимикробно действие</strong><span> на ментата.</span></p>
// <p dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-za-stomashni-bolki_480x480.webp?v=1708515209" alt="мента за стомашни болки" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-za-stomashni-bolki_480x480.webp?v=1708515209"></span></span></p>
// <p dir="ltr"><span>Ментата и ментовото масло намират широко приложение както в хранителната, така и във фармацевтичната индустрия. Тя има множество </span><strong>полезни качества</strong><span> и затова се използва широко в народната и традиционната медицина.</span><span></span></p>
// <p dir="ltr"><strong>Помага при различни състояния като:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Горещи вълни при жени, на които предстои менопауза</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Синдром на дразнимото дебело черво (колон иритабиле)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Инфекции с вируса херпес симплекс</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Състояния на тревожност и безпокойство</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Психически натоварвания</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Гадене и лошо храносмилане.</span></p>
// </li>
// </ul>
// <h3 dir="ltr"><span>Ползи от ментата върху нервната система</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/stres-naprejenie-vitaon.._480x480.webp?v=1707830065" alt="мелатонин спрей мента за успокоение" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/stres-naprejenie-vitaon.._480x480.webp?v=1707830065"></span></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-4b064c21-7fff-c966-d883-58372272fea6"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Ментата от години се използва в традиционната и народната медицина заради нейния </span><strong>успокояващ ефект</strong><span>. Етеричните ѝ масла успокояват мозъка и помагат за постигане на състояние на релакс.&nbsp;</span></p>
// <p dir="ltr"><span>Приемът на ментов</span><span> <strong>екстракт преди лягане</strong></span><span> допринасят за по-бързото “изключване” на мисловните процеси като така допринася за по-бързото заспиване.</span></p>
// <p dir="ltr"><span>Приет през деня, екстрактът от мента стимулира отделянето на серотинин и помага за </span><a href="https://vitaon.bg/collections/dobavki-stres-depresiya" data-mce-href="https://vitaon.bg/collections/dobavki-stres-depresiya"><span>подобряване на настроението</span></a><span>, премахва тревожността и помага при състояния на лека субклинична депресия.</span></p>
// <h3 dir="ltr"><span>Други ползи от приема на мента за човешкия организъм</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-protiv-gadene-i-povrashtane._480x480.webp?v=1707917604" alt="мента при гадене" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-protiv-gadene-i-povrashtane._480x480.webp?v=1707917604"></span></span></p>
// <p dir="ltr"><span>Ментата е ефективна за облекчаване на различни симптоми, свързани със стомашно-чревния тракт, спазми, подуване на корема. Подобрява храносмилането. Облекчава възпалителни състояния на чревната и стомашната лигавица.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-9b691fc7-7fff-e06e-ce48-07850ff59e0a"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Ментата притежава и аналгетични свойства или казано по друг начин - има </span><strong>обезболяващ ефект</strong><span><strong>.</strong> Той се медиира посредством активацията на к-опиоидния рецептор, като се блокира предаването на болкови сигнали.</span></p>
// <p dir="ltr"><span>Доказателство за ефектите на ментата при лечение на колон иритабиле дава и проучване на Кохрейн от 2006 година, който потвърждава, че 79% от пациентите с това заболяване съобщават за сигнификантно редуциране на болковата симптоматика след 2 седмичен прием на</span><span> </span><a href="https://vitaon.bg/collections/bilkovi-tinkturi" data-mce-href="https://vitaon.bg/collections/bilkovi-tinkturi"><span>екстракт от билката</span></a><span>.&nbsp;</span></p>
// <p dir="ltr"><span>Поради сходство в рецепторите, които се експресират в целия гастроинтестинален тракт, ментовия екстракт изразява антиспазматично действие при жлъчни колики, чревни колики, стомашни крампи. Повлиява също и гладката мускулатура на матката, като жените благоприятстват от този ефект по време на </span><strong>болезнен цикъл.</strong></p>
// <h2 dir="ltr"><span>Валериана (Valeriana Officianalis)</span></h2>
// <h2 dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei._480x480.webp?v=1708508248" alt="валериана мелатонин спрей" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei._480x480.webp?v=1708508248"></span>&nbsp;</span></h2>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-541a0ad7-7fff-f9cd-af90-dfdcf4aeaef1"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Валериана, или още </span><strong>лечебна дилянка</strong><span>, е многогодишно цъфтящо растение, произхождащо от Европа и Азия. Латинското му наименование е Valeriana Officinalis.&nbsp;</span></p>
// <p dir="ltr"><span>Известно още от дълбока древност, поне от времето на древните гърци и римляни, това растение се е използвало широко в народната медицина. Хипократ и Гален описват неговите качества като </span><strong>успокоително средство</strong><span> и са го предписвали на </span><strong>страдащите от безсъние.&nbsp;</strong></p>
// <p dir="ltr"><span>В настоящето, коренът на растението влиза най-често в употреба, като от него се приготвя екстракт. Той притежава успокоителен ефект и премахва тревожността.</span></p>
// <p dir="ltr"><span>Съдържанието на екстракта от валериана е изключително богато по състав на активни химически вещества. Някои от тях са изучени и действието им е доказано и познато, а друга част от тях са все още в процес на проучване.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-26cc986f-7fff-1d6c-471f-8f2754666757"></b><meta charset="utf-8"></b></span></span></span></p>
// <h3 dir="ltr"><span>Активни вещества в екстракта от валериана</span></h3>
// <p dir="ltr"><span>Коренът на валериана е изключително богат на активни вещества, разделени в няколко групи.</span></p>
// <p dir="ltr"><strong>Тези групи включват:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Алкалоиди - актинидин, хатинин, шиантин, валерин и валерианин</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Изовалерамиди</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Гама-аминобутарат (GABA)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Изовалерианова киселина</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Иридоиди, включително валепотриати: изовалтарат и валтарат</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Сескитерпени - валеренова киселина, хидроксивалеренова киселина и ацетоксивалеренова киселина</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Флавонони - хесперидин, 6-метилапигенин и линарин</span></p>
// </li>
// </ul>
// <h3 dir="ltr"><span>Ползи от валериана, подпомагащи действието на Мелатонин спрей</span></h3>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-5d4a3d0e-7fff-35bf-7758-a392b1718062"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>Валерианата е добре проучена </span><strong>билка</strong><span><strong>.</strong> За науката е наясно, че зад нейните ползи, свързани със </span><span><strong>съня и успокоението</strong> </span><span>на организма, стоят конкретни вещества, принадлежащи към някои от изброените по-горе групи. Това са веществата изовалерамид и валеренова киселина.</span></p>
// <h3 dir="ltr"><span>Ползи от Изовалерамид за съня и нервната система</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-biosintez_480x480.webp?v=1708516924" alt="мелатонин спрей биоанализ" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-biosintez_480x480.webp?v=1708516924"></span></span></p>
// <p dir="ltr"><span>Изовалерамид е органично съединиение, производно на изовалериановата киселина. Съдържа се именно в екстракта от корена на растението. Действието му в малки дози е да </span><strong>намалява тревожността</strong><span>, а в по-големи дози може да действа като </span><strong>слабо приспивателно.</strong></p>
// <p dir="ltr"><span>Това вещество е активно в ЦНС и преминава кръвно-мозъчната бариера.</span></p>
// <p dir="ltr"><span>Представлява позитивен алостеричен модулатор на GABAa рецептора. Това означава, че се свързва с друг алостеричен център на рецептора, като потенциира и усилва действието на основния лиганд, в случая - Гама-аминобутиричната киселина.</span></p>
// <p dir="ltr"><span>Тя има депресивно действие върху ЦНС и е важна за процесите на заспиване. По този начин изовалеричната киселина доказано води до </span><strong>по-бързо заспиване</strong><span><strong> и </strong></span><strong>по-дълъг и качествен сън.</strong></p>
// <p dir="ltr"><span>Интересното за нея е, че блокира ензима, който преработва алкохола, а именно алкохолната дехидрогеназа. Тази особеност е важна и трябва да се има предвид при консумацията на алкохол и приема на мелатонин спрей или други продукти, съдържащи валериана.</span></p>
// <h3 dir="ltr"><span>Валеренова киселина</span></h3>
// <p dir="ltr"><span>Тази органична киселина представлява съединение от групата на сесквитерпените. Тя е една от основните съставки на етеричното масло от валериана.</span></p>
// <p dir="ltr"><span>Валериана се използва от дълбока древност като </span><strong>естествено успокоително</strong><span> и </span><strong>приспивателно средство</strong><span>, което освен на изовалерамида се дължи именно на валериановата киселина.</span></p>
// <p dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-pri-bezsanie-melatonin-sprei_480x480.webp?v=1708515422" alt="валериана при безсъние мелатонин спрей" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-pri-bezsanie-melatonin-sprei_480x480.webp?v=1708515422"></span></span></p>
// <p dir="ltr"><span>Други две киселини, сходни на валероновата - хидроксивалеронова и ацетоксивалеронова, също допринасят за тези свойства на билката. Често </span><a href="https://vitaon.bg/collections/hranitelni-dobavki" data-mce-href="https://vitaon.bg/collections/hranitelni-dobavki"><span>хранителните добавки и екстракти</span></a><span> </span><span>от корен на валериана са стандартизирани да съдържат определено количество валеронова киселина (обикновено 0,8% от теглото).</span></p>
// <p dir="ltr"><span>Валероновата кис</span><span>елина действа като подтип-селективен GABA рецепторен позитивен алостеричен модулатор, като отново засилва действието на гама- аминобутиричната киселина.&nbsp;</span></p>
// <p dir="ltr"><span>Тази киселина се свърза също и с друг рецептор, този път серотонинов. Става дума за 5-НТ. Валероновата киселина при свързването си с този рецептор действа като частичен агонист (тоест подсилва действието на веществото).</span></p>
// <p dir="ltr"><span>За разлика от GABA-рецептора, който стриктно регулира трансмисията само на гама-аминобутиричната киселина, серотониновият рецептор има регулаторно действие върху редица други </span><strong>невротрансмитери.</strong></p>
// <p dir="ltr"><span>Той също участва в механизмите за регулиране на цикъла сън-бодърстване. Именно затова валероновата киселина оказва </span><strong>седативно и успокоително действие</strong><span>, действайки върху два рецептора, отговорни за сходни функции и процеси.</span></p>
// <h2 dir="ltr"><span>Какви са предимствата на Мелатонин спрей на ВитаОн?</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей ползи заключение" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-polzi...._480x480.webp?v=1708505896" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-polzi...._480x480.webp?v=1708505896"></span></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-819f2f0a-7fff-55e0-74b6-aecacb2de468"></b><meta charset="utf-8"></b></span></span></span></p>
// <p dir="ltr"><span>В нашия продукт, ние внимателно сме подбрали съставките, за да действат абсолютно синергично в мисията си да ви дарят с един </span><strong>дълъг, качествен, истински релаксиращ сън.</strong></p>
// <p dir="ltr"><span>Подбрали сме </span><strong>течна форма</strong><span> и на трите съставки, които се допълват в своето действие. Това ви дава предимството на по-бързо и лесно усвояване и съответно - по-бързо настъпване на желаните ефекти.</span></p>
// <p dir="ltr"><span>Нашият продукт ще е вашето средство да се справяте с натовареното ежедневие, защото ще осигури един </span><strong>дълбок и пълноценен сън</strong><span>. Приемът му гарантира поддържане на оптимални енергийни нива през целия ден и чувство на благоденствие.</span></p>
// <p dir="ltr"><span>За ваше улеснение ние предлагаме формула, която се прилага под </span><strong>формата на спрей</strong><span> в устната кухина. За неговото създаване сме използвали само премиум екстракти от билките мента и валериана.</span></p>
// <h2 dir="ltr"><span>Често задавани въпроси</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="въпроси за мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243"></span></span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-633e42ca-7fff-6d05-fce7-d66ae72628e2"></b><meta charset="utf-8"></b></span></span></span></p>
// <h3 dir="ltr"><span>Подходящ ли е мелатонинът за деца?</span></h3>
// <p dir="ltr"><span>Не, детският организъм има доста по-добра регулация на процесите сън-бодърстване от този на възрастен човек. Спазването на режим на лягане и ставане в един и същи час до голяма степен оптимизира нивата на мелатонин при децата.&nbsp;</span></p>
// <h3 dir="ltr"><span>Работи ли наистина спреят за сън с мелатонин?</span></h3>
// <p dir="ltr"><span>Да, спреят за сън с мелатонин помага за по-бързо релаксиране и заспиване. Освен това, в дългосрочен план, суплементацията с мелатонин води до редица други ползи за нашето здраве, особено що се касае за нервната ни система.</span></p>
// <h3 dir="ltr"><span>Колко бързо действа спреят с мелатонин?</span></h3>
// <p dir="ltr"><span>При пръскане на спрей под езика, при условие на загасени светлини и отстраняване на дразнителите, продуктът оказва действие за около 10-15 минути.</span></p>
// <h3 dir="ltr"><span>Как да приемам мелатонин спрей за сън?</span></h3>
// <p dir="ltr"><span>Най-добре е да се приема при пълна подготовка за сън - когато сме легнали в покой, загасили сме светлините и сме отстранили възможните звукови и светлинни дразнители.</span></p>
// <p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b id="docs-internal-guid-7280d09f-7fff-fa51-f32b-4cba486e070e"></b></span></span></span></p>
// <ul></ul>
  


//   </div>`;

  try {
    for (let i = 0; i < count; i++) {
      const product = await client.query({
        data: {
          query: CREATE_PRODUCTS_MUTATION,
          variables: {
            input: {
              title: `${randomTitle()}`,
              // descriptionHtml: `${toc} ${productDescription}`,
              descriptionHtml: htmlString,
              variants: [{ price: randomPrice() }],
            },
          },
        },
      });
    }
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}

export async function productHtmlDescriptionFormatter(session) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    const products = await getAllProducts(session);

    const UPDATE_PRODUCT_MUTATION = `
      mutation UpdateProduct($id: ID!, $descriptionHtml: String!) {
        productUpdate(input: {
          id: $id,
          descriptionHtml: $descriptionHtml,
        }) {
          product {
            id
            descriptionHtml
          }
        }
      }
    `;

    for (const product of products) {

      const descriptionHtml = product.node.descriptionHtml;
      const toc = createToc(descriptionHtml);
      const productDescription = createProductDescription(descriptionHtml);

      // console.log(`--------------jsonn----------`);
      // console.log(toc.tocJson);



        await client.query({
        data: {
          query: UPDATE_PRODUCT_MUTATION,
          variables: {
            id: product.node.id,
            descriptionHtml: `${toc.tocHtml} ${productDescription}`,
          },
        },
      });

      console.log('---------------------tocgenerated--------------------');

    }
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}


export async function getAllProducts(session) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    const response = await client.query({
      data: {
        query: GET_ALL_PRODUCTS_QUERY,
      },
    });

    console.log(`-------------------------product created------------------------`);
 
    // response.body.data.products.edges.forEach(node=>{
    //   console.log(node.node.metafields);
    // });

    return response.body.data.products.edges;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}

function randomTitle() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective} ${noun}`;
}

function randomPrice() {
  return Math.round((Math.random() * 10 + Number.EPSILON) * 100) / 100;
}
