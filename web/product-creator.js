import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import createToc from "./toc.js";
import createProductDescription from "./product-description.js";
import { DEFAULT_PRODUCTS_COUNT } from "./constants.js";

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
query shopInfo {
  products(first: 50) {
    edges {
      node {
        title
        id
        descriptionHtml
        metafields(first: 50) { 
          edges {
            node {
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
  // 1.the html string

  //prime workout
  const htmlString = `<div class="prose prose-2xl text-black mx-auto mt-8 px-8 prose-img:rounded-xl">
  
  <p dir="ltr"><span>Нашата премиум формула за </span><span><strong>хранителна добавка Прайм уъркаут</strong> </span><span>е специално подбрана комбинация от висококачествени натурални съставки, които ще подпомогнат вашата ефикасност по време на </span><strong>тренировъчния процес</strong><span> във физически и психически аспект.</span></p>
<p dir="ltr"><span>За разлика от другите </span><strong>предтренировъчни продукти</strong><span><strong>,</strong> Prime Workout ще ви осигури постоянни нива на енергия и концентрация и ще предостави условия за оптимално възстановяване на вашия организъм.</span></p>
<p dir="ltr"><span>Ефектите от Prime Workout, които ще усетите, засягат различни аспекти от тренировъчния процес и ще ви подготвят за по-тежките последващи тренировки.</span></p>
<h2 dir="ltr"><span>Съдържание на продукта</span></h2>
<p><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-opisanie-bilki._480x480.webp?v=1710773939" alt="описание на хранителна добавка prime workout" style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-opisanie-bilki._480x480.webp?v=1710773939" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Единична доза: 1 капсула.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Количество: 100 капсули.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Опакова за: 50 дни</span></p>
</li>
</ul>
<p dir="ltr"><span>Съдържание в единична доза – 1 капсула (1100 мг.):</span></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Аргинин AKG</strong><span> – 388,5 мг. (35%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Л-Карнитин тартрат</strong><span> – 333 мг. (30%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span><strong>Левзея корен екстракт</strong> </span><span>– 111 мг. (10%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span><strong>Сибирски Женшен екстракт</strong> </span><span>– 111 мг. (10%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Мурсалски чай екстракт </strong><span>– 55,5 мг. (5%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Магарешки бодил екстракт</strong><span><strong> </strong>– 55,5 мг. (5%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span><strong>Зелен чай екстракт</strong> </span><span>– 55,5 мг. (5%)</span></p>
</li>
</ul>
<p dir="ltr"><span>Дневна доза: 2 капсули</span></p>
<p dir="ltr"><span>Съдържание в дневна доза – 2 капсули (2200 мг.):</span></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Аргинин AKG – 777 мг. (35%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Л-Карнитин тартрат – 666 мг. (30%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Левзея корен екстракт – 222 мг. (10%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Сибирски Женшен екстракт – 222 мг. (10%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Мурсалски чай екстракт – 111 мг. (5%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Магарешки бодил екстракт – 111 мг. (5%)</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Зелен чай екстракт – 111 мг. (5%)</span></p>
</li>
</ul>
<div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/detoks-prilojenie_1_480x480.webp?v=1704872472"></div>
<p dir="ltr"><strong>Предлагаме чиста и естествена подкрепа за вашето здраве:</strong></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>100% активни съставки</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Вегетарианска формула</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Без глутен</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Без лактоза</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Без добавена захар</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Без консерванти и изкуствени оцветители</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Не е тестван върху животни.</span></p>
</li>
</ul>
<h2 dir="ltr"><span>Препоръки за прием</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-na-priem-hranitelna-dobavka_480x480.webp?v=1704896462" alt="начин на прием prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-na-priem-hranitelna-dobavka_480x480.webp?v=1704896462"></span></span></p>
<h3 dir="ltr"><span>Препоръчителен дневен прием</span></h3>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Две (2) капсули, 45-60 мин. преди тренировка.</span></p>
</li>
</ul>
<h3 dir="ltr"><span>Препоръчителен период на прием&nbsp;</span></h3>
<p dir="ltr"><span>За максимални резултати е добре да се приема до 3 месеца (12 седмици). След период на почивка от около 2 седмици, цикълът може да се повтори.</span></p>
<h3 dir="ltr"><span>Други препоръки</span></h3>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Само за перорално приложение.&nbsp;</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Да не се превишава препоръчителната дневна доза.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Да не се приема от бременни и кърмещи жени.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Продуктът не е заместител на разнообразното хранене.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Продуктът не е лекарствено средство, а хранителна добавка.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Консултирайте се с вашия личен лекар преди прием.</span></p>
</li>
</ul>
<h2 dir="ltr"><span>За кого е подходяща добавката Прайм уъркаут?</span></h2>
<div style="text-align: left;" data-mce-style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/levzeya-hranitelna-dobavka-za-sportisti_480x480.webp?v=1708439657" alt="хранителна добавка prime workout за кого е подходящ" style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/levzeya-hranitelna-dobavka-za-sportisti_480x480.webp?v=1708439657" data-mce-style="margin-bottom: 16px; float: none;"></div>
<p dir="ltr"><span>Продуктът “Prime Workout” е подходящ за приемане от всеки, който извършва интензивни физически натоварвания и е превърнал спорта и състезанието със собствените си възможности в начин на живот.</span></p>
<p dir="ltr"><span>Подходящ е както за стимулиране на фокуса и силата на ума, така и за оптимизиране на процесите, протичащи в мускулите по време на тренировки.</span></p>
<p dir="ltr"><span>Ползи от този продукт биха имали и хора, които имат твърде динамичен и стресиращ начин на живота, извършващи умствена работа или подложени на голям психо-емоционален стрес.</span></p>
<p dir="ltr"><span>Доверието на нашите клиенти е важно за нас. Поради това всеки продукт разполага с регистрационен номер, издаден от Агенцията, отговорна за контрола над храните и хранителни добавки, с който се верифицира неговата автентичност и качество: </span><span>Т032400081</span></p>
<h2 dir="ltr"><span>GMP сертификат&nbsp;</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589" alt="gmp prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589"></span></span></p>
<p dir="ltr"><span>GMP сертификат - Добрата производствена практика - представлява златния стандарт в </span><strong>производството на хранителни добавки.</strong></p>
<p dir="ltr"><span>Продуктите на VitaOn се произвеждат, спазвайки стриктно производствените процеси и налагайки строг контрол във всеки етап, гарантирайки </span><strong>високо качество и безопасност.</strong></p>
<p dir="ltr"><span>GMP сертификатите са своеобразно доказателство за отдадеността на компанията ни, да ви предоставя само първокласни </span><strong>премиум продукти.</strong></p>
<p dir="ltr"><span>Ние поставяме като приоритети постоянството, точността и чистотата и по този начин ви предлагаме спокойствие и доверие, за които носим отговорност.</span></p>
<h2 dir="ltr">
<span>Описание на Prime Workout</span><span></span><span></span>
</h2>
<p dir="ltr"><span>“Prime Workout” представлява уникална по рода си формула и </span><strong>хранителна добавка</strong><span>, която съчетава в себе си две натурални аминокиселини и пет растения, които имат доказани качества за човешкото тяло.</span></p>
<p dir="ltr"><span>Комбинацията е изключително интересна поради това, че адресира двата най-важни аспекта на всяка тренировка - физическия и нервно-психическия.</span></p>
<p dir="ltr"><span>Същността на тренировъчния процес представлява да научим мозъка и волята си да поставят все по-трудни препятствия пред нашето тяло и по този начин да подобряваме </span><strong>физическата си форма</strong><span>. Това ангажира изключително нашата нервна система и скелетно-мускулния ни апарат.&nbsp;</span></p>
<p dir="ltr"><span>Поради това възстановителните процеси трябва да са адекватни и реципрочни според натоварването.</span></p>
<p dir="ltr"><span>Комбинацията от съставки в нашия продукт дава на тялото ни необходимото, за да може да даде всичко от себе си във физическия аспект. Съчетанието от </span><strong>адаптогенни и стимулиращи билки</strong><span> правят това възможно.&nbsp;</span></p>
<p dir="ltr"><span>“Prime Workout” съдържа аминокиселината Аргинин и непротеиновата аминокиселина с витаминна природа Л-карнитин.</span></p>
<p dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout_480x480.webp?v=1702302790" alt="primeworkout infografika" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout_480x480.webp?v=1702302790"></span></span></p>
<p dir="ltr"><strong>В него се съдържат и няколко растения с доказан ефект:</strong></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Аргинин AKG</strong><span> - има съдоразширяващ ефект, подпомага храненето на мускулите и допринася за “напомпващия ефект”.</span></p>
</li>
</ul>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Л-Карнитин тартрат</strong><span> - аминокиселина с витаминна природа, отговорен за синтеза на енергия в клетките и повишаващ издръжливостта.</span></p>
</li>
</ul>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Левзея корен екстракт </strong><span>- адаптогенна билка за която се твърди, че повишава протеиновия синтез, силата, мускулната маса и либидото при мъжа.</span></p>
</li>
</ul>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Сибирски женшен екстракт</strong><span> - адаптогенна билка, която подобрява концентрацията и нормализира нивата на стресовия хормон кортизол.</span></p>
</li>
</ul>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Мурсалски чай екстракт</strong><span> - отново адаптогенна билка, известна като българската виагра. Повишава тонуса и чувството за сила, има качества на афродизиак.</span></p>
</li>
</ul>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><strong>Магарешки бодил екстракт</strong><span><strong> </strong>- притежава възбуждащ ефект върху нервната система и стимулира сърдечната дейност.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span><strong>Зелен чай екстракт</strong> </span><span>- енергетик, антиоксидант, притежава стимулиращо действие върху централната нервна система (ЦНС).</span></p>
</li>
</ul>
<h2 dir="ltr"><span>Ползи от приема на Prime Workout</span></h2>
<p dir="ltr"><span>Ползите от приема на този иновативен и изцяло</span><span> <strong>натурален предтренировъчен продукт</strong> </span><span>са множество. Те не се ограничават само до търсения напомпващ ефект от обикновените продукти от този тип.&nbsp;</span></p>
<p dir="ltr"><span>Благодарение на </span><a href="https://vitaon.bg/collections/bilkovi-tinkturi" data-mce-href="https://vitaon.bg/collections/bilkovi-tinkturi"><span>билковите екстракти</span></a><span>, включени в Prime Workout, се наблюдават различни ползи за цялостното здраве и благосъстояние на нашия организъм.</span></p>
<p dir="ltr"><span>Те се дължат на различните компоненти и активни вещества, които подпомагат действието си едно на друго и засилват цялостния ефект от </span><strong>приема на добавката</strong><span>. Изборът на тези съставки е ръководен именно от холистичния принцип, който се стреми да засегне всички аспекти на здравето, свързани с </span><strong>усилените тренировки.</strong></p>
<h3 dir="ltr"><span>Ползи от Л- аргинин в Прайм уъркаут</span></h3>
<p><span><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="prime workout за енергия" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/hranitelni-dobavki-za-energiya._480x480.webp?v=1710772211" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/hranitelni-dobavki-za-energiya._480x480.webp?v=1710772211" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
<h4 dir="ltr"><span>Имунна система и анаболни процеси</span></h4>
<p dir="ltr"><span>Л-аргинин е </span><strong>незаменима аминокиселина</strong><span>, която тялото ни не може да синтезира и си я набавя чрез храната, която поемаме.</span></p>
<p dir="ltr"><span>Л-аргинин е прекурсор на азотния оксид. Тази молекула има редица роли в човешкото тяло. Отговаря за клетъчната сигнализация между клетките на имунната система и регулира имунния отговор.</span></p>
<p dir="ltr"><span>Той влиза в състава на протеините и участва в анаболните процеси.</span></p>
<h4 dir="ltr"><span>Креатин и АТФ</span></h4>
<p dir="ltr"><span>Освен това е една от трите аминокиселини, от които се образува </span><strong>креатинът</strong><span>. Креатинът, под неговата активна форма креатин фосфат, е енергоносеща молекула отговорна за синтеза на АТФ.&nbsp;</span></p>
<p dir="ltr"><span>Особено нужен е по време на</span><span> <strong>физическо натоварване</strong></span><span>, където служи за отдаване на фосфатна група към молекулата на Аденозин дифосфат, превръщайки го в АТФ.</span></p>
<p dir="ltr"><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/izdrujlivost-energiq_480x480.webp?v=1705309006" alt="prime workout за повече енергия" style="margin-bottom: 16px; float: none;" data-mce-style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/izdrujlivost-energiq_480x480.webp?v=1705309006"></span></p>
<h4 dir="ltr"><span>Кръвоносни съдове</span></h4>
<p dir="ltr"><span>Азотният окис освен като клетъчен сигнализатор изпълнява ролята и на мощен </span><span><strong>вазодилататор</strong> </span><span>- това означава, че той има способността да разширява кръвоносните съдове. По този начин се осъществява повишаване на кръвотока в скелетната мускулатура.</span></p>
<p dir="ltr"><strong>Това води до:</strong></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Засилен транспорт на глюкоза и аминокиселини в мускулните клетки, което подпомага анаболитните и възстановителните процеси.</span></p>
</li>
</ul>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Повишено активно отделяне на токсични продукти от мускулните клетки, които са отговорни за мускулната умора и намаляване на силата, а именно млечната киселина.</span></p>
</li>
</ul>
<p dir="ltr"><span>В резултат имаме по-здрави, по-издръжливи и по-силни мускули, които могат да преодоляват по-тежки и интензивни натоварвания.</span></p>
<h4 dir="ltr"><span>Хормон на растежа</span></h4>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="действие на л аргинин тостесторен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/povishen-testosteron-vitaon....._480x480.webp?v=1707831794" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/povishen-testosteron-vitaon....._480x480.webp?v=1707831794"></span></span></p>
<p dir="ltr"><span>Съществуват проучвания, които доказват, че приемът на аминокиселината през устата може да доведе до повишение в </span><span><strong>серумните нива на хормона на растежа</strong> </span><span>до 100%. В същото проучване, нивата на хормон на растежа при физически натоварвания, съчетани с прием на Л-аргинин, може да се повиши от 300 до 500%.</span></p>
<p dir="ltr"><span>Това са статистически значими последствия от приема на аминокиселината. Хормонът на растежа е отговорен за мускулния растеж и метаболизма на хранителни вещества. Повишените стойности около физически стимули води до </span><strong>подобряване на спортните постижения</strong><span>, нарастване на мускулната маса и по-добро възстановяване.</span></p>
<h3 dir="ltr"><span>Ползи от Л-карнитин в Прайм уъркаут</span></h3>
<div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/l-karnitin-hranitelna-dobavka-v-stak_480x480.webp?v=1709110213" alt="l-carnitine за спортисти" style="margin-bottom: 16px; float: none;"></div>
<p dir="ltr"><span>Л-карнитин е вещество с аминокиселинна природа, което не се включва в състава на белтъчините. По същество представлява </span><strong>витамин.</strong></p>
<p dir="ltr"><span>Той е условно незаменим, което ще рече, че освен при определени условия, нуждите на организма ни от Л-карнитин никога не превъзхождат способността на тялото ни да го синтезира.</span></p>
<p dir="ltr"><span>Разбира се, това не означава, че допълнителния му прием е излишен.&nbsp;</span></p>
<p dir="ltr"><span>За да извлечем ползите от него, свързани със </span><strong>спорта</strong><span>, ни трябват по-големи количества, които да повишават концентрацията му в плазмата. Това не може да се случи, ако оставим на организма ни сам да го произведе.</span></p>
<p dir="ltr"><span>Основната роля на това вещество е да участва в процесите, свързани с </span><span><strong>обмен на енергия</strong> </span><span>и по-скоро изгарянето на енергия.&nbsp;</span></p>
<p dir="ltr"><span>Той служи като транспорт на мастните киселини до митохондриите, където се подлагат на процес на окисление и се разграждат до лесно усвоима енергия.</span></p>
<p dir="ltr"><span>Особено ефективен е върху</span><span> <strong>физическото представяне</strong> </span><span>при хора, практикуващи спортове, свързани с издръжливост - бягане, плуване, колоездене.</span></p>
<p dir="ltr"><span>Подобрява </span><strong>мускулната издръжливост</strong><span> при аеробни натоварвания и ускорява метаболизма.</span></p>
<h3 dir="ltr"><span>Ползи от левзея в Прайм уъркаут</span></h3>
<div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/psihichno-zdrave._480x480.webp?v=1704461972" alt="ползи от левзея" style="margin-bottom: 16px; float: none;"></div>
<p dir="ltr"><span>Левзеята е </span><strong>адаптогенна билка</strong><span>, разпространена най-вече в Сибир, Северна Русия и Казахстан. Коренът ѝ е богат на активни вторични метаболити. Най-известните от тях са от групата на сапонините - бета-екдистерона.</span></p>
<p dir="ltr"><span>На него дължим ефектите на билката върху тялото ни. Те са разнообразни - помага ни да се справяме със стреса - както физическия, така и психо-емоционалния.&nbsp;</span></p>
<p dir="ltr"><span>Освен това Левзеята е мощен афродизиак и се счита, че подобрява половата мощ.</span></p>
<p dir="ltr"><span>Липсват убедителни проучвания, но все пак съществуват данни,че приемът ѝ води до </span><a href="https://vitaon.bg/collections/hranitelni-dobavki-muskulna-masa" data-mce-href="https://vitaon.bg/collections/hranitelni-dobavki-muskulna-masa"><span>нарастване на мускулната маса</span></a><span>, увеличаване на анаболния синтез, както и подобряване на силовата издръжливост.</span></p>
<p dir="ltr"><span>Левзеята съдържа в себе си вторични метаболити, които имат изразени антиоксидантни свойства и допринасят за деактивирането на свободните радикали, които са плод от мускулния метаболизъм.</span></p>
<h3 dir="ltr"><span>Ползи от Сибирски женшен в Прайм уъркаут</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="сибирски жен шен корен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/jen-shen-koren_480x480.webp?v=1705048986" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/jen-shen-koren_480x480.webp?v=1705048986"></span></span></p>
<p dir="ltr"><span>Сибирският женшен е лечебно растение, чиито качества са световноизвестни и признати.</span></p>
<p dir="ltr"><span>Той е богат на активни вторични метаболити, които участват в редица процеси, извършвани в </span><strong>човешкото тяло</strong><span>. Те са причината за полезните свойства на билката върху организма ни.</span></p>
<p dir="ltr"><strong>Някои от най-изявените ползи включват:</strong></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Счита се, че Сибирският женшен е мощен адаптоген. Помага при справяне със стресови ситуации и потиска нивата на кортизола.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Регулира </span><strong>енергийните нива</strong><span> и ги разпределя правилно, за да може да подсигури плавен приток на енергия, без пикове и спадове, както е характерно за стимулантите.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Той притежава силно антиоксидантно действие и се използва като</span><span> </span><a href="https://vitaon.bg/collections/bilki-otslabvane-detoksikaciya" data-mce-href="https://vitaon.bg/collections/bilki-otslabvane-detoksikaciya"><span>билка за детоксикиране на тялото</span></a><span>, както и за подобряване на средата за извършване на физиологични процеси.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Съществуват данни, че тази билка играе роля в хомеостазата на половите хормони, като приемът му води до повишаване на нивата на свободния тестостерон.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Женшенът помага на организма ни да работи в екстремни условия. Той има положително влияние върху ЦНС. Регулира настроението и фокуса, подобрява когнитивните способности.</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Ефективен е за употреба от </span><strong>спортисти</strong><span>, повишава мускулната издръжливост и подобрява притока на кръв към мозъка и към крайниците ни.</span></p>
</li>
</ul>
<h3 dir="ltr"><span>Ползи от Мурсалски чай в Прайм уъркаут</span></h3>
<p><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/mursalski-chai-opisanie.._480x480.webp?v=1710830530" alt="мурсалски чай описание" style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/mursalski-chai-opisanie.._480x480.webp?v=1710830530" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
<p dir="ltr"><span>Известен под името Българската виагра, този представител на родната ни флора и билкова аптека се счита за мощен афродизиак.</span></p>
<p dir="ltr"><span>Според народната медицина, тази билка </span><strong>увеличава сексуалното желание</strong><span>, половата мощ и фертилитета.</span></p>
<p dir="ltr"><span>Това растение притежава мощни </span><strong>антиоксидантни свойства</strong><span> и помага на организма ни в борбата с оксидативния стрес. Вероятно именно това действие е отговорно за силните му адаптогенни свойства.</span></p>
<p dir="ltr"><span>Счита се, без да са налични сигнификантни литературни доказателства, че билката понижава нивата на кортизола (хормона на стреса) и има благоприятно влияние върху глюкозния метаболизъм.</span></p>
<p dir="ltr"><span>Мурсалския чай е наричан още Родопско чудо и се употребява в планинските райони на България почти като панацея.</span></p>
<p dir="ltr"><strong>Енергизира тялото и духа</strong><span> и помага за възстановителните процеси в организма.</span></p>
<h3 dir="ltr"><span>Ползи от магарешки бодил в Прайм уъркаут</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/magareshki-bodil_480x480.webp?v=1705044207" alt="магарешки бодил действие" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/magareshki-bodil_480x480.webp?v=1705044207"></span></span></p>
<p dir="ltr"><span>Магарешкият бодил е двугодишно растение, което вероятно всеки от нас е виждал. Вирее по поляни, пасища и ливади. Предпочита директна слънчева светлина.</span></p>
<p dir="ltr"><span>В народната медицина това лечебно растение се препоръчва за </span><a href="https://vitaon.bg/collections/dobavki-vitamini-otpadnalost-umora" data-mce-href="https://vitaon.bg/collections/dobavki-vitamini-otpadnalost-umora"><span>тонизиране и енергизиране на организма</span></a><span>. Приема се при кашлица, синузити и бронхити, където показва добро секретолитично и отхрачващо действие.</span></p>
<p dir="ltr"><span>Билката има общоукрепващо и имуностимулиращо действие, притежава диуретичен ефект и предпазва сърдечния мускул и бъбреците. Помага при артериална хипертония.</span></p>
<p dir="ltr"><span>В бодибилдинг средите, магарешкият бодил се счита за растение, което притежава </span><strong>анаболно действие</strong><span>, подпомагащо синтеза на протеини. Това действие се обяснява със съдържанието му на сапонини - растителни вещества, подобни на стероидите.</span></p>
<p dir="ltr"><span>Подобрява </span><strong>възстановяването на мускулите</strong><span> след тренировка и ги подготвя за по-тежки натоварвания.</span></p>
<p dir="ltr"><span>Магарешкият бодил има възбуждащо действие върху ЦНС, като я подготвя за периоди на интензивни натоварвания.</span></p>
<h3 dir="ltr"><span>Ползи от зелен чай в Прайм уъркаут</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/zelen-chai-deistvie_480x480.webp?v=1705048298" alt="зелен чай действие" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/zelen-chai-deistvie_480x480.webp?v=1705048298"></span></span></p>
<p dir="ltr"><span>Зеленият чай е растение, притежаващо редица ползи за човешкото здраве. Интересен факт за него е, че той е втората най-употребявана напитка след водата в цял свят.</span></p>
<p dir="ltr"><span>Има много сортове зелен чай, но всички те се отличават със високото съдържание на полифенолни съединения, флавоноиди, катехини и кофеин.</span></p>
<p dir="ltr"><span>Зеленият чай е </span><a href="https://vitaon.bg/collections/antioksidanti" data-mce-href="https://vitaon.bg/collections/antioksidanti"><span>мощен антиоксидант</span></a><span> и детоксикиращ агент. Участва активно в борбата със свободните радикали и оксидативния стрес.</span></p>
<p dir="ltr"><span>Наличието на кофеин в него допринася за стимулаторното му въздействие върху нервната система, като повишава фокуса преди физически натоварвания.</span></p>
<p dir="ltr"><span>Има силен</span><span> <strong>енергизиращ ефект</strong></span><span>, като освен това катехините в него имат термогенно действие. Повишава метаболизма и мобилизира липидните и гликогенни запаси към митохондриите, където да бъдат разградени и преобразувани в енергия.</span></p>
<h2 dir="ltr"><span>Какви са предимствата на Prime Workout на ВитаОн?</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-zakluchenie._480x480.webp?v=1704974177" alt="заключение prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-zakluchenie._480x480.webp?v=1704974177"></span></span></p>
<p dir="ltr"><span>Продуктът ‘’Prime Workout” е иновативен по своето съдържание, защото комбинира ефектите на две важни за тялото ни и тренировъчния процес аминокиселини с действието на естествени адаптогенни билки.</span></p>
<p dir="ltr"><span>Резултатът, който “PrimeWorkout” ще ни помогне да постигнем, е да повиши нужната концентрация и мотивация, за да подобрим </span><strong>постиженията си в спорта</strong><span> и всеки път да бъдем по-добри от предходния.</span></p>
<p dir="ltr"><span>Приемът му ще засили темповете на нужните за възстановяването ни анаболни процеси и ще оптимизира елиминирането на токсините от мускулите.</span></p>
<p dir="ltr"><span>Този продукт не е типичната </span><strong>предтренировъчна добавка</strong><span>, която е пренаситена от стимуланти, които да натоварят допълнително нашата нервна система. Ние вярваме в постоянството и в системните резултати, стъпка по стъпка.&nbsp;</span></p>
<p dir="ltr"><span>Затова енергията, която ще ви даде “Prime Workout” ще бъде плавна и постоянна, без пикове и спадове, и ще държи нашата нервна система в кондиция, за да може бързо да се възстановим между отделните натоварвания и да бъдем все по-ефективни.</span></p>
<h2 dir="ltr"><span>Често задавани въпроси</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243" alt="въпроси prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243"></span></span></p>
<h3 dir="ltr"><span>Здравословно ли е да се приемат предтренировъчни продукти, какъвто е "Prime Workout" ?&nbsp;</span></h3>
<p dir="ltr"><span>За разлика от други предтренировъчни продукти, в нашата добавка наличието на стимуланти (кофеин) е с изцяло естествен произход (съдържа се в зеления чай) в дози, които са напълно безопасни. Освен това съдържанието на адаптогенни билки и натурални съставки правят "Prime Workout" здравословен продукт, подходящ както за спортисти, така и за хора, които имат динамично ежедневие.</span></p>
<h3 dir="ltr"><span>Може ли да приемам "Prime Workout" след хранене?&nbsp;</span></h3>
<p dir="ltr"><span>Прайм уъркаут, макар и по-различен от конкурентни продукти, е добре да се приема на гладно преди тренировка. Ако все пак приемате продукта след хранене, ще отнеме повече време да усетите ползите от него поради предимно билковата му природа. По този начин вие няма да може да се възползвате от непосредствения ефект, който имат някои от съставките.</span></p>
<h3 dir="ltr"><span>Какво да очаквам от приема на Prime Workout?</span></h3>
<p dir="ltr"><span>Приемът на хранителната добавка ще подобри вашата концентрация и мотивация по време на тренировъчния процес, ще увеличи силата и издръжливостта ви и ще ви накара да се почувствате по-енергични.</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"></span></p>
  


  </div>`;

  try {
    for (let i = 0; i < count; i++) {
      await client.query({
        data: {
          query: CREATE_PRODUCTS_MUTATION,
          variables: {
            input: {
              title: `${randomTitle()}`,
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
    // Fetch all products from the session
    const products = await getAllProducts(session);

    // GraphQL mutation to update the product's description and metafield
    const UPDATE_PRODUCT_MUTATION = `
      mutation UpdateProduct($id: ID!, $descriptionHtml: String!) {
        productUpdate(
          input: {
            id: $id,
            descriptionHtml: $descriptionHtml,
            metafields: [
              {
                key: "toc",
                namespace: "custom",
                value: "toc is generated",
                type: "single_line_text_field"
              }
            ]
          }
        ) {
          product {
            id
            descriptionHtml
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Check if there are any products to process
    if (products.length > 0) {
      // Filter products that do not have the ToC generated
      const productsWithoutToc = products.filter(
        (product) => !product.isTocGenerated
      );

      for (const product of productsWithoutToc) {
        const descriptionHtml = product.descriptionHtml;

        // Generate ToC and updated product description
        const toc = createToc(descriptionHtml);
        const productDescription = createProductDescription(descriptionHtml);

        // Update product with the new descriptionHtml including the ToC
        const response = await client.query({
          data: {
            query: UPDATE_PRODUCT_MUTATION,
            variables: {
              id: `gid://shopify/Product/${product.id}`,
              descriptionHtml: `${toc.tocHtml} ${productDescription}`,
            },
          },
        });

        // Check for user errors in the response
        if (response.data.productUpdate.userErrors.length > 0) {
          throw new Error(
            `Failed to update product ${
              product.id
            }: ${response.data.productUpdate.userErrors
              .map((error) => error.message)
              .join(", ")}`
          );
        }

        console.log(
          `Product ${product.id} ToC generated and updated successfully.`
        );
      }
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

export async function generateTocForSingleProduct(
  session,
  gid,
  productDescription
) {
  const client = new shopify.api.clients.Graphql({ session });

  console.log(gid);
  console.log(productDescription);

  const toc = createToc(productDescription);
  const generateProductDescription =
    createProductDescription(productDescription);

  try {
    const GENERATE_TOC_FOR_PRODUCT = `
    mutation UpdateProduct($id: ID!, $descriptionHtml: String!) {
      productUpdate(
        input: {
          id: $id,
          descriptionHtml: $descriptionHtml,
          metafields: [
            {
              key: "toc",
              namespace: "custom",
              value: "toc is generated",
            }
          ]
        }
      ) {
        product {
          id
          descriptionHtml
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const response = await client.query({
      data: {
        query: GENERATE_TOC_FOR_PRODUCT,
        variables: {
          id: `gid://shopify/Product/${gid}`,
          descriptionHtml: `${toc.tocHtml} ${generateProductDescription}`,
        },
      },
    });

    // Check for user errors in the response
    if (response.data.productUpdate.userErrors.length > 0) {
      throw new Error(
        `Failed to update product ${
          product.id
        }: ${response.data.productUpdate.userErrors
          .map((error) => error.message)
          .join(", ")}`
      );
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

    const products = response.body.data.products.edges;

    const allProducts = [];

    products.forEach((product) => {
      if (
        !product.node.metafields.edges.some(
          (metafield) => metafield.node.value === "toc is generated"
        )
      ) {
        allProducts.push({
          title: product.node.title,
          id: product.node.id.split("Product/")[1],
          descriptionHtml: product.node.descriptionHtml,
          isTocGenerated: false,
        });
      } else {
        allProducts.push({
          title: product.node.title,
          id: product.node.id.split("Product/")[1],
          descriptionHtml: product.node.descriptionHtml,
          isTocGenerated: true,
        });
      }
    });

    return allProducts;
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
