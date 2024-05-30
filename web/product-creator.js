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

const GET_SINGLE_PRODUCT_QUERY = `
query getSingleProduct($id : ID!) {
  product(id: $id) {
    id
    title
    descriptionHtml
    metafields(first: 10) {
      edges {
        node {
          id
          namespace
          key
          value
        }
      }
    }
  }
}`;

const GENERATE_TOC_FOR_PRODUCT_MUTATION = `
mutation UpdateProduct($id: ID!, $descriptionHtml: String!, $metafieldToc: String!) {
  productUpdate(
    input: {
      id: $id,
      descriptionHtml: $descriptionHtml,
      metafields: [
        {
          key: "toc",
          namespace: "custom",
          value: $metafieldToc,
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

const EDIT_TOC_FOR_PRODUCT_MUTATION = `
mutation UpdateProduct($id: ID!, $metafieldToc: String!, $metafieldId: ID!) {
  productUpdate(
    input: {
      id: $id,
      metafields: [
        {
          id: $metafieldId,
          value: $metafieldToc,
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

const EDIT_DESCRIPTION_HTML_FOR_PRODUCT_MUTATION = `
mutation UpdateProduct($id: ID!, $descriptionHtml: String!) {
  productUpdate(
    input: {
      id: $id,
      descriptionHtml: $descriptionHtml,
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

const UPDATE_PRODUCT_HTML_AND_METAFIELD_MUTATION = `mutation UpdateProduct($id: ID!, $descriptionHtml: String!, $metafieldId: ID!, $metafieldValue: String!) {
  productUpdate(
    input: {
      id: $id,
      descriptionHtml: $descriptionHtml,
      metafields: [
        {
          id: $metafieldId,
          value: $metafieldValue
        }
      ]
    }
  ) {
    product {
      id
      descriptionHtml
      metafields(first: 10) {
        edges {
          node {
            id
            namespace
            key
            value
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`

export async function productCreator(session, count = DEFAULT_PRODUCTS_COUNT) {
  const client = new shopify.api.clients.Graphql({ session });
  // 1.the html string

  //prime workout
//   const htmlString = `<div class="prose prose-2xl text-black mx-auto mt-8 px-8 prose-img:rounded-xl">
  
//   <p dir="ltr"><span>Нашата премиум формула за </span><span><strong>хранителна добавка Прайм уъркаут</strong> </span><span>е специално подбрана комбинация от висококачествени натурални съставки, които ще подпомогнат вашата ефикасност по време на </span><strong>тренировъчния процес</strong><span> във физически и психически аспект.</span></p>
// <p dir="ltr"><span>За разлика от другите </span><strong>предтренировъчни продукти</strong><span><strong>,</strong> Prime Workout ще ви осигури постоянни нива на енергия и концентрация и ще предостави условия за оптимално възстановяване на вашия организъм.</span></p>
// <p dir="ltr"><span>Ефектите от Prime Workout, които ще усетите, засягат различни аспекти от тренировъчния процес и ще ви подготвят за по-тежките последващи тренировки.</span></p>
// <h2 dir="ltr"><span>Съдържание на продукта</span></h2>
// <p><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-opisanie-bilki._480x480.webp?v=1710773939" alt="описание на хранителна добавка prime workout" style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-opisanie-bilki._480x480.webp?v=1710773939" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Единична доза: 1 капсула.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Количество: 100 капсули.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Опакова за: 50 дни</span></p>
// </li>
// </ul>
// <p dir="ltr"><span>Съдържание в единична доза – 1 капсула (1100 мг.):</span></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Аргинин AKG</strong><span> – 388,5 мг. (35%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Л-Карнитин тартрат</strong><span> – 333 мг. (30%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span><strong>Левзея корен екстракт</strong> </span><span>– 111 мг. (10%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span><strong>Сибирски Женшен екстракт</strong> </span><span>– 111 мг. (10%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Мурсалски чай екстракт </strong><span>– 55,5 мг. (5%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Магарешки бодил екстракт</strong><span><strong> </strong>– 55,5 мг. (5%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span><strong>Зелен чай екстракт</strong> </span><span>– 55,5 мг. (5%)</span></p>
// </li>
// </ul>
// <p dir="ltr"><span>Дневна доза: 2 капсули</span></p>
// <p dir="ltr"><span>Съдържание в дневна доза – 2 капсули (2200 мг.):</span></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Аргинин AKG – 777 мг. (35%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Л-Карнитин тартрат – 666 мг. (30%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Левзея корен екстракт – 222 мг. (10%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Сибирски Женшен екстракт – 222 мг. (10%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Мурсалски чай екстракт – 111 мг. (5%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Магарешки бодил екстракт – 111 мг. (5%)</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Зелен чай екстракт – 111 мг. (5%)</span></p>
// </li>
// </ul>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/detoks-prilojenie_1_480x480.webp?v=1704872472"></div>
// <p dir="ltr"><strong>Предлагаме чиста и естествена подкрепа за вашето здраве:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>100% активни съставки</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Вегетарианска формула</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Без глутен</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Без лактоза</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Без добавена захар</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Без консерванти и изкуствени оцветители</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Не е тестван върху животни.</span></p>
// </li>
// </ul>
// <h2 dir="ltr"><span>Препоръки за прием</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-na-priem-hranitelna-dobavka_480x480.webp?v=1704896462" alt="начин на прием prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-na-priem-hranitelna-dobavka_480x480.webp?v=1704896462"></span></span></p>
// <h3 dir="ltr"><span>Препоръчителен дневен прием</span></h3>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Две (2) капсули, 45-60 мин. преди тренировка.</span></p>
// </li>
// </ul>
// <h3 dir="ltr"><span>Препоръчителен период на прием&nbsp;</span></h3>
// <p dir="ltr"><span>За максимални резултати е добре да се приема до 3 месеца (12 седмици). След период на почивка от около 2 седмици, цикълът може да се повтори.</span></p>
// <h3 dir="ltr"><span>Други препоръки</span></h3>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Само за перорално приложение.&nbsp;</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Да не се превишава препоръчителната дневна доза.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Да не се приема от бременни и кърмещи жени.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Продуктът не е заместител на разнообразното хранене.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Продуктът не е лекарствено средство, а хранителна добавка.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Консултирайте се с вашия личен лекар преди прием.</span></p>
// </li>
// </ul>
// <h2 dir="ltr"><span>За кого е подходяща добавката Прайм уъркаут?</span></h2>
// <div style="text-align: left;" data-mce-style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/levzeya-hranitelna-dobavka-za-sportisti_480x480.webp?v=1708439657" alt="хранителна добавка prime workout за кого е подходящ" style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/levzeya-hranitelna-dobavka-za-sportisti_480x480.webp?v=1708439657" data-mce-style="margin-bottom: 16px; float: none;"></div>
// <p dir="ltr"><span>Продуктът “Prime Workout” е подходящ за приемане от всеки, който извършва интензивни физически натоварвания и е превърнал спорта и състезанието със собствените си възможности в начин на живот.</span></p>
// <p dir="ltr"><span>Подходящ е както за стимулиране на фокуса и силата на ума, така и за оптимизиране на процесите, протичащи в мускулите по време на тренировки.</span></p>
// <p dir="ltr"><span>Ползи от този продукт биха имали и хора, които имат твърде динамичен и стресиращ начин на живота, извършващи умствена работа или подложени на голям психо-емоционален стрес.</span></p>
// <p dir="ltr"><span>Доверието на нашите клиенти е важно за нас. Поради това всеки продукт разполага с регистрационен номер, издаден от Агенцията, отговорна за контрола над храните и хранителни добавки, с който се верифицира неговата автентичност и качество: </span><span>Т032400081</span></p>
// <h2 dir="ltr"><span>GMP сертификат&nbsp;</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589" alt="gmp prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589"></span></span></p>
// <p dir="ltr"><span>GMP сертификат - Добрата производствена практика - представлява златния стандарт в </span><strong>производството на хранителни добавки.</strong></p>
// <p dir="ltr"><span>Продуктите на VitaOn се произвеждат, спазвайки стриктно производствените процеси и налагайки строг контрол във всеки етап, гарантирайки </span><strong>високо качество и безопасност.</strong></p>
// <p dir="ltr"><span>GMP сертификатите са своеобразно доказателство за отдадеността на компанията ни, да ви предоставя само първокласни </span><strong>премиум продукти.</strong></p>
// <p dir="ltr"><span>Ние поставяме като приоритети постоянството, точността и чистотата и по този начин ви предлагаме спокойствие и доверие, за които носим отговорност.</span></p>
// <h2 dir="ltr">
// <span>Описание на Prime Workout</span><span></span><span></span>
// </h2>
// <p dir="ltr"><span>“Prime Workout” представлява уникална по рода си формула и </span><strong>хранителна добавка</strong><span>, която съчетава в себе си две натурални аминокиселини и пет растения, които имат доказани качества за човешкото тяло.</span></p>
// <p dir="ltr"><span>Комбинацията е изключително интересна поради това, че адресира двата най-важни аспекта на всяка тренировка - физическия и нервно-психическия.</span></p>
// <p dir="ltr"><span>Същността на тренировъчния процес представлява да научим мозъка и волята си да поставят все по-трудни препятствия пред нашето тяло и по този начин да подобряваме </span><strong>физическата си форма</strong><span>. Това ангажира изключително нашата нервна система и скелетно-мускулния ни апарат.&nbsp;</span></p>
// <p dir="ltr"><span>Поради това възстановителните процеси трябва да са адекватни и реципрочни според натоварването.</span></p>
// <p dir="ltr"><span>Комбинацията от съставки в нашия продукт дава на тялото ни необходимото, за да може да даде всичко от себе си във физическия аспект. Съчетанието от </span><strong>адаптогенни и стимулиращи билки</strong><span> правят това възможно.&nbsp;</span></p>
// <p dir="ltr"><span>“Prime Workout” съдържа аминокиселината Аргинин и непротеиновата аминокиселина с витаминна природа Л-карнитин.</span></p>
// <p dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout_480x480.webp?v=1702302790" alt="primeworkout infografika" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout_480x480.webp?v=1702302790"></span></span></p>
// <p dir="ltr"><strong>В него се съдържат и няколко растения с доказан ефект:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Аргинин AKG</strong><span> - има съдоразширяващ ефект, подпомага храненето на мускулите и допринася за “напомпващия ефект”.</span></p>
// </li>
// </ul>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Л-Карнитин тартрат</strong><span> - аминокиселина с витаминна природа, отговорен за синтеза на енергия в клетките и повишаващ издръжливостта.</span></p>
// </li>
// </ul>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Левзея корен екстракт </strong><span>- адаптогенна билка за която се твърди, че повишава протеиновия синтез, силата, мускулната маса и либидото при мъжа.</span></p>
// </li>
// </ul>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Сибирски женшен екстракт</strong><span> - адаптогенна билка, която подобрява концентрацията и нормализира нивата на стресовия хормон кортизол.</span></p>
// </li>
// </ul>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Мурсалски чай екстракт</strong><span> - отново адаптогенна билка, известна като българската виагра. Повишава тонуса и чувството за сила, има качества на афродизиак.</span></p>
// </li>
// </ul>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><strong>Магарешки бодил екстракт</strong><span><strong> </strong>- притежава възбуждащ ефект върху нервната система и стимулира сърдечната дейност.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span><strong>Зелен чай екстракт</strong> </span><span>- енергетик, антиоксидант, притежава стимулиращо действие върху централната нервна система (ЦНС).</span></p>
// </li>
// </ul>
// <h2 dir="ltr"><span>Ползи от приема на Prime Workout</span></h2>
// <p dir="ltr"><span>Ползите от приема на този иновативен и изцяло</span><span> <strong>натурален предтренировъчен продукт</strong> </span><span>са множество. Те не се ограничават само до търсения напомпващ ефект от обикновените продукти от този тип.&nbsp;</span></p>
// <p dir="ltr"><span>Благодарение на </span><a href="https://vitaon.bg/collections/bilkovi-tinkturi" data-mce-href="https://vitaon.bg/collections/bilkovi-tinkturi"><span>билковите екстракти</span></a><span>, включени в Prime Workout, се наблюдават различни ползи за цялостното здраве и благосъстояние на нашия организъм.</span></p>
// <p dir="ltr"><span>Те се дължат на различните компоненти и активни вещества, които подпомагат действието си едно на друго и засилват цялостния ефект от </span><strong>приема на добавката</strong><span>. Изборът на тези съставки е ръководен именно от холистичния принцип, който се стреми да засегне всички аспекти на здравето, свързани с </span><strong>усилените тренировки.</strong></p>
// <h3 dir="ltr"><span>Ползи от Л- аргинин в Прайм уъркаут</span></h3>
// <p><span><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="prime workout за енергия" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/hranitelni-dobavki-za-energiya._480x480.webp?v=1710772211" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/hranitelni-dobavki-za-energiya._480x480.webp?v=1710772211" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
// <h4 dir="ltr"><span>Имунна система и анаболни процеси</span></h4>
// <p dir="ltr"><span>Л-аргинин е </span><strong>незаменима аминокиселина</strong><span>, която тялото ни не може да синтезира и си я набавя чрез храната, която поемаме.</span></p>
// <p dir="ltr"><span>Л-аргинин е прекурсор на азотния оксид. Тази молекула има редица роли в човешкото тяло. Отговаря за клетъчната сигнализация между клетките на имунната система и регулира имунния отговор.</span></p>
// <p dir="ltr"><span>Той влиза в състава на протеините и участва в анаболните процеси.</span></p>
// <h4 dir="ltr"><span>Креатин и АТФ</span></h4>
// <p dir="ltr"><span>Освен това е една от трите аминокиселини, от които се образува </span><strong>креатинът</strong><span>. Креатинът, под неговата активна форма креатин фосфат, е енергоносеща молекула отговорна за синтеза на АТФ.&nbsp;</span></p>
// <p dir="ltr"><span>Особено нужен е по време на</span><span> <strong>физическо натоварване</strong></span><span>, където служи за отдаване на фосфатна група към молекулата на Аденозин дифосфат, превръщайки го в АТФ.</span></p>
// <p dir="ltr"><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/izdrujlivost-energiq_480x480.webp?v=1705309006" alt="prime workout за повече енергия" style="margin-bottom: 16px; float: none;" data-mce-style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/izdrujlivost-energiq_480x480.webp?v=1705309006"></span></p>
// <h4 dir="ltr"><span>Кръвоносни съдове</span></h4>
// <p dir="ltr"><span>Азотният окис освен като клетъчен сигнализатор изпълнява ролята и на мощен </span><span><strong>вазодилататор</strong> </span><span>- това означава, че той има способността да разширява кръвоносните съдове. По този начин се осъществява повишаване на кръвотока в скелетната мускулатура.</span></p>
// <p dir="ltr"><strong>Това води до:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Засилен транспорт на глюкоза и аминокиселини в мускулните клетки, което подпомага анаболитните и възстановителните процеси.</span></p>
// </li>
// </ul>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Повишено активно отделяне на токсични продукти от мускулните клетки, които са отговорни за мускулната умора и намаляване на силата, а именно млечната киселина.</span></p>
// </li>
// </ul>
// <p dir="ltr"><span>В резултат имаме по-здрави, по-издръжливи и по-силни мускули, които могат да преодоляват по-тежки и интензивни натоварвания.</span></p>
// <h4 dir="ltr"><span>Хормон на растежа</span></h4>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="действие на л аргинин тостесторен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/povishen-testosteron-vitaon....._480x480.webp?v=1707831794" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/povishen-testosteron-vitaon....._480x480.webp?v=1707831794"></span></span></p>
// <p dir="ltr"><span>Съществуват проучвания, които доказват, че приемът на аминокиселината през устата може да доведе до повишение в </span><span><strong>серумните нива на хормона на растежа</strong> </span><span>до 100%. В същото проучване, нивата на хормон на растежа при физически натоварвания, съчетани с прием на Л-аргинин, може да се повиши от 300 до 500%.</span></p>
// <p dir="ltr"><span>Това са статистически значими последствия от приема на аминокиселината. Хормонът на растежа е отговорен за мускулния растеж и метаболизма на хранителни вещества. Повишените стойности около физически стимули води до </span><strong>подобряване на спортните постижения</strong><span>, нарастване на мускулната маса и по-добро възстановяване.</span></p>
// <h3 dir="ltr"><span>Ползи от Л-карнитин в Прайм уъркаут</span></h3>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/l-karnitin-hranitelna-dobavka-v-stak_480x480.webp?v=1709110213" alt="l-carnitine за спортисти" style="margin-bottom: 16px; float: none;"></div>
// <p dir="ltr"><span>Л-карнитин е вещество с аминокиселинна природа, което не се включва в състава на белтъчините. По същество представлява </span><strong>витамин.</strong></p>
// <p dir="ltr"><span>Той е условно незаменим, което ще рече, че освен при определени условия, нуждите на организма ни от Л-карнитин никога не превъзхождат способността на тялото ни да го синтезира.</span></p>
// <p dir="ltr"><span>Разбира се, това не означава, че допълнителния му прием е излишен.&nbsp;</span></p>
// <p dir="ltr"><span>За да извлечем ползите от него, свързани със </span><strong>спорта</strong><span>, ни трябват по-големи количества, които да повишават концентрацията му в плазмата. Това не може да се случи, ако оставим на организма ни сам да го произведе.</span></p>
// <p dir="ltr"><span>Основната роля на това вещество е да участва в процесите, свързани с </span><span><strong>обмен на енергия</strong> </span><span>и по-скоро изгарянето на енергия.&nbsp;</span></p>
// <p dir="ltr"><span>Той служи като транспорт на мастните киселини до митохондриите, където се подлагат на процес на окисление и се разграждат до лесно усвоима енергия.</span></p>
// <p dir="ltr"><span>Особено ефективен е върху</span><span> <strong>физическото представяне</strong> </span><span>при хора, практикуващи спортове, свързани с издръжливост - бягане, плуване, колоездене.</span></p>
// <p dir="ltr"><span>Подобрява </span><strong>мускулната издръжливост</strong><span> при аеробни натоварвания и ускорява метаболизма.</span></p>
// <h3 dir="ltr"><span>Ползи от левзея в Прайм уъркаут</span></h3>
// <div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/psihichno-zdrave._480x480.webp?v=1704461972" alt="ползи от левзея" style="margin-bottom: 16px; float: none;"></div>
// <p dir="ltr"><span>Левзеята е </span><strong>адаптогенна билка</strong><span>, разпространена най-вече в Сибир, Северна Русия и Казахстан. Коренът ѝ е богат на активни вторични метаболити. Най-известните от тях са от групата на сапонините - бета-екдистерона.</span></p>
// <p dir="ltr"><span>На него дължим ефектите на билката върху тялото ни. Те са разнообразни - помага ни да се справяме със стреса - както физическия, така и психо-емоционалния.&nbsp;</span></p>
// <p dir="ltr"><span>Освен това Левзеята е мощен афродизиак и се счита, че подобрява половата мощ.</span></p>
// <p dir="ltr"><span>Липсват убедителни проучвания, но все пак съществуват данни,че приемът ѝ води до </span><a href="https://vitaon.bg/collections/hranitelni-dobavki-muskulna-masa" data-mce-href="https://vitaon.bg/collections/hranitelni-dobavki-muskulna-masa"><span>нарастване на мускулната маса</span></a><span>, увеличаване на анаболния синтез, както и подобряване на силовата издръжливост.</span></p>
// <p dir="ltr"><span>Левзеята съдържа в себе си вторични метаболити, които имат изразени антиоксидантни свойства и допринасят за деактивирането на свободните радикали, които са плод от мускулния метаболизъм.</span></p>
// <h3 dir="ltr"><span>Ползи от Сибирски женшен в Прайм уъркаут</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="сибирски жен шен корен" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/jen-shen-koren_480x480.webp?v=1705048986" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/jen-shen-koren_480x480.webp?v=1705048986"></span></span></p>
// <p dir="ltr"><span>Сибирският женшен е лечебно растение, чиито качества са световноизвестни и признати.</span></p>
// <p dir="ltr"><span>Той е богат на активни вторични метаболити, които участват в редица процеси, извършвани в </span><strong>човешкото тяло</strong><span>. Те са причината за полезните свойства на билката върху организма ни.</span></p>
// <p dir="ltr"><strong>Някои от най-изявените ползи включват:</strong></p>
// <ul>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Счита се, че Сибирският женшен е мощен адаптоген. Помага при справяне със стресови ситуации и потиска нивата на кортизола.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Регулира </span><strong>енергийните нива</strong><span> и ги разпределя правилно, за да може да подсигури плавен приток на енергия, без пикове и спадове, както е характерно за стимулантите.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Той притежава силно антиоксидантно действие и се използва като</span><span> </span><a href="https://vitaon.bg/collections/bilki-otslabvane-detoksikaciya" data-mce-href="https://vitaon.bg/collections/bilki-otslabvane-detoksikaciya"><span>билка за детоксикиране на тялото</span></a><span>, както и за подобряване на средата за извършване на физиологични процеси.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Съществуват данни, че тази билка играе роля в хомеостазата на половите хормони, като приемът му води до повишаване на нивата на свободния тестостерон.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Женшенът помага на организма ни да работи в екстремни условия. Той има положително влияние върху ЦНС. Регулира настроението и фокуса, подобрява когнитивните способности.</span></p>
// </li>
// <li dir="ltr" aria-level="1">
// <p dir="ltr" role="presentation"><span>Ефективен е за употреба от </span><strong>спортисти</strong><span>, повишава мускулната издръжливост и подобрява притока на кръв към мозъка и към крайниците ни.</span></p>
// </li>
// </ul>
// <h3 dir="ltr"><span>Ползи от Мурсалски чай в Прайм уъркаут</span></h3>
// <p><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/mursalski-chai-opisanie.._480x480.webp?v=1710830530" alt="мурсалски чай описание" style="margin-bottom: 16px; float: none;" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/mursalski-chai-opisanie.._480x480.webp?v=1710830530" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
// <p dir="ltr"><span>Известен под името Българската виагра, този представител на родната ни флора и билкова аптека се счита за мощен афродизиак.</span></p>
// <p dir="ltr"><span>Според народната медицина, тази билка </span><strong>увеличава сексуалното желание</strong><span>, половата мощ и фертилитета.</span></p>
// <p dir="ltr"><span>Това растение притежава мощни </span><strong>антиоксидантни свойства</strong><span> и помага на организма ни в борбата с оксидативния стрес. Вероятно именно това действие е отговорно за силните му адаптогенни свойства.</span></p>
// <p dir="ltr"><span>Счита се, без да са налични сигнификантни литературни доказателства, че билката понижава нивата на кортизола (хормона на стреса) и има благоприятно влияние върху глюкозния метаболизъм.</span></p>
// <p dir="ltr"><span>Мурсалския чай е наричан още Родопско чудо и се употребява в планинските райони на България почти като панацея.</span></p>
// <p dir="ltr"><strong>Енергизира тялото и духа</strong><span> и помага за възстановителните процеси в организма.</span></p>
// <h3 dir="ltr"><span>Ползи от магарешки бодил в Прайм уъркаут</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/magareshki-bodil_480x480.webp?v=1705044207" alt="магарешки бодил действие" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/magareshki-bodil_480x480.webp?v=1705044207"></span></span></p>
// <p dir="ltr"><span>Магарешкият бодил е двугодишно растение, което вероятно всеки от нас е виждал. Вирее по поляни, пасища и ливади. Предпочита директна слънчева светлина.</span></p>
// <p dir="ltr"><span>В народната медицина това лечебно растение се препоръчва за </span><a href="https://vitaon.bg/collections/dobavki-vitamini-otpadnalost-umora" data-mce-href="https://vitaon.bg/collections/dobavki-vitamini-otpadnalost-umora"><span>тонизиране и енергизиране на организма</span></a><span>. Приема се при кашлица, синузити и бронхити, където показва добро секретолитично и отхрачващо действие.</span></p>
// <p dir="ltr"><span>Билката има общоукрепващо и имуностимулиращо действие, притежава диуретичен ефект и предпазва сърдечния мускул и бъбреците. Помага при артериална хипертония.</span></p>
// <p dir="ltr"><span>В бодибилдинг средите, магарешкият бодил се счита за растение, което притежава </span><strong>анаболно действие</strong><span>, подпомагащо синтеза на протеини. Това действие се обяснява със съдържанието му на сапонини - растителни вещества, подобни на стероидите.</span></p>
// <p dir="ltr"><span>Подобрява </span><strong>възстановяването на мускулите</strong><span> след тренировка и ги подготвя за по-тежки натоварвания.</span></p>
// <p dir="ltr"><span>Магарешкият бодил има възбуждащо действие върху ЦНС, като я подготвя за периоди на интензивни натоварвания.</span></p>
// <h3 dir="ltr"><span>Ползи от зелен чай в Прайм уъркаут</span></h3>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/zelen-chai-deistvie_480x480.webp?v=1705048298" alt="зелен чай действие" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/zelen-chai-deistvie_480x480.webp?v=1705048298"></span></span></p>
// <p dir="ltr"><span>Зеленият чай е растение, притежаващо редица ползи за човешкото здраве. Интересен факт за него е, че той е втората най-употребявана напитка след водата в цял свят.</span></p>
// <p dir="ltr"><span>Има много сортове зелен чай, но всички те се отличават със високото съдържание на полифенолни съединения, флавоноиди, катехини и кофеин.</span></p>
// <p dir="ltr"><span>Зеленият чай е </span><a href="https://vitaon.bg/collections/antioksidanti" data-mce-href="https://vitaon.bg/collections/antioksidanti"><span>мощен антиоксидант</span></a><span> и детоксикиращ агент. Участва активно в борбата със свободните радикали и оксидативния стрес.</span></p>
// <p dir="ltr"><span>Наличието на кофеин в него допринася за стимулаторното му въздействие върху нервната система, като повишава фокуса преди физически натоварвания.</span></p>
// <p dir="ltr"><span>Има силен</span><span> <strong>енергизиращ ефект</strong></span><span>, като освен това катехините в него имат термогенно действие. Повишава метаболизма и мобилизира липидните и гликогенни запаси към митохондриите, където да бъдат разградени и преобразувани в енергия.</span></p>
// <h2 dir="ltr"><span>Какви са предимствата на Prime Workout на ВитаОн?</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-zakluchenie._480x480.webp?v=1704974177" alt="заключение prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/prime-workout-zakluchenie._480x480.webp?v=1704974177"></span></span></p>
// <p dir="ltr"><span>Продуктът ‘’Prime Workout” е иновативен по своето съдържание, защото комбинира ефектите на две важни за тялото ни и тренировъчния процес аминокиселини с действието на естествени адаптогенни билки.</span></p>
// <p dir="ltr"><span>Резултатът, който “PrimeWorkout” ще ни помогне да постигнем, е да повиши нужната концентрация и мотивация, за да подобрим </span><strong>постиженията си в спорта</strong><span> и всеки път да бъдем по-добри от предходния.</span></p>
// <p dir="ltr"><span>Приемът му ще засили темповете на нужните за възстановяването ни анаболни процеси и ще оптимизира елиминирането на токсините от мускулите.</span></p>
// <p dir="ltr"><span>Този продукт не е типичната </span><strong>предтренировъчна добавка</strong><span>, която е пренаситена от стимуланти, които да натоварят допълнително нашата нервна система. Ние вярваме в постоянството и в системните резултати, стъпка по стъпка.&nbsp;</span></p>
// <p dir="ltr"><span>Затова енергията, която ще ви даде “Prime Workout” ще бъде плавна и постоянна, без пикове и спадове, и ще държи нашата нервна система в кондиция, за да може бързо да се възстановим между отделните натоварвания и да бъдем все по-ефективни.</span></p>
// <h2 dir="ltr"><span>Често задавани въпроси</span></h2>
// <p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243" alt="въпроси prime workout" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243"></span></span></p>
// <h3 dir="ltr"><span>Здравословно ли е да се приемат предтренировъчни продукти, какъвто е "Prime Workout" ?&nbsp;</span></h3>
// <p dir="ltr"><span>За разлика от други предтренировъчни продукти, в нашата добавка наличието на стимуланти (кофеин) е с изцяло естествен произход (съдържа се в зеления чай) в дози, които са напълно безопасни. Освен това съдържанието на адаптогенни билки и натурални съставки правят "Prime Workout" здравословен продукт, подходящ както за спортисти, така и за хора, които имат динамично ежедневие.</span></p>
// <h3 dir="ltr"><span>Може ли да приемам "Prime Workout" след хранене?&nbsp;</span></h3>
// <p dir="ltr"><span>Прайм уъркаут, макар и по-различен от конкурентни продукти, е добре да се приема на гладно преди тренировка. Ако все пак приемате продукта след хранене, ще отнеме повече време да усетите ползите от него поради предимно билковата му природа. По този начин вие няма да може да се възползвате от непосредствения ефект, който имат някои от съставките.</span></p>
// <h3 dir="ltr"><span>Какво да очаквам от приема на Prime Workout?</span></h3>
// <p dir="ltr"><span>Приемът на хранителната добавка ще подобри вашата концентрация и мотивация по време на тренировъчния процес, ще увеличи силата и издръжливостта ви и ще ви накара да се почувствате по-енергични.</span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"></span></p>
  


//   </div>`;

//melatonin spray
const htmlString = `<div class="prose prose-2xl text-black mx-auto mt-8 px-8 prose-img:rounded-xl">
  
<p dir="ltr"><span>Мелатонин спрей представлява натурално помощно средство, съдържащо в себе си <strong>"</strong></span><strong>хормона на съня</strong><span><strong>"</strong> и екстракти от </span><strong>билките мента и валериана</strong><span> под формата на спрей за впръскване под езика. Комбинацията от трите съставки действа благоприятно на човешкия организъм и в синергизъм една с друга, като има благоприятен ефект за постигане на спокоен и качествен сън.</span></p>
<h2 dir="ltr"><span>Съдържание на продукта</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_480x480.webp?v=1701767331" alt="мелатонин спрей" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_480x480.webp?v=1701767331"></span></span></span></span></p>
<p dir="ltr"><span><strong>Основни съставки</strong>: </span><span>Съставки: Мента (Mentha) екстракт, валериан (Valeriana officinalis) екстракт, мелатонин, пречистена вода, етанол.</span></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Едно впръскване: 0,3 ml</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Количество: 30 ml</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Опаковка за: 100 дни</span></p>
</li>
</ul>
<p dir="ltr"><span>В едно впръскване – водно-етанолов екстракт (16%):</span></p>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Мелатонин – 1 mg</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Мента екстракт – 4 mg</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Валериан екстракт – 2 mg</span></p>
</li>
</ul>
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
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-napriem-melatonin-sprei_480x480.webp?v=1708507127" alt="начина на прием мелатонин спрей" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/nachin-napriem-melatonin-sprei_480x480.webp?v=1708507127"></span></span></p>
<h3 dir="ltr"><span>Препоръчителен дневен прием</span></h3>
<p dir="ltr"><span>Впръскайте еднократно под езика, веднъж дневно – вечер 30 минути преди сън.&nbsp;</span></p>
<h3 dir="ltr"><span>Препоръчителен период на прием</span></h3>
<ul>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Приемайте този продукт при нужда.&nbsp;</span></p>
</li>
<li dir="ltr" aria-level="1">
<p dir="ltr" role="presentation"><span>Непрекъснатият прием води до бързо привикване.</span></p>
</li>
</ul>
<h3 dir="ltr"><span>Други препоръки:</span></h3>
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
<h2 dir="ltr"><span>За кого е подходящ?</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011" alt="мелатонин спрей при безсъние" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011"></span></span></p>
<p dir="ltr"><span>Продуктът е подходящ за всеки човек, който има </span><strong>затруднения при заспиване </strong><span>или </span><strong>неспокоен сън</strong><span>.</span></p>
<p dir="ltr"><span>Също така е добър избор за хора, които имат ограничено време за сън - така ще осигурят<strong> </strong></span><span><strong>по-бързо заспиване</strong> </span><span>и навлизане в REM-фазите на съня, където се осъществяват съвършените регенераторни процеси.</span></p>
<p dir="ltr"><span>Има общоукрепващо, успокояващо и леко седативно действие. Проявява антиоксидантно действие, както и протективен ефект върху централната нервна система (ЦНС).</span></p>
<p dir="ltr"><span>Профилактира различни нервно-дегенеративни заболявания и е добър избор за допълнително лечение при хора в начални фази на болестта на Алцхаймер и деменция.</span></p>
<p dir="ltr"><span>Доверието на нашите клиенти е важно за нас. Поради това всеки продукт разполага с регистрационен номер, издаден от Агенцията, отговорна за контрола над храните и хранителни добавки, с който се верифицира неговата автентичност и качество: Т032304821</span></p>
<h2 dir="ltr">
<span>GMP сертификат</span><span></span>
</h2>
<h2><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589" alt="GMP сертификат" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/gmp-certified._480x480.webp?v=1702470589"></span></h2>
<p dir="ltr"><span>GMP сертификат - Добрата производствена практика - представлява златния стандарт в </span><strong>производството на хранителни добавки.&nbsp;</strong></p>
<p dir="ltr"><span>Продуктите на VitaОn се произвеждат, спазвайки стриктно производствените процеси и налагайки строг контрол във всеки етап, гарантирайки високо качество и безопасност.&nbsp;</span></p>
<p dir="ltr"><span>GMP сертификатите са своеобразно доказателство за отдадеността на компанията ни, да ви предоставя само първокласни </span><strong>премиум продукти.&nbsp;</strong></p>
<p dir="ltr"><span>Ние поставяме като приоритети постоянството, точността и чистотата и по този начин ви предлагаме спокойствие и доверие, за които носим отговорност.</span></p>
<h2 dir="ltr"><span>Какво е мелатонин?</span></h2>
<p dir="ltr"><span>Мелатонинът, или както е известен още <strong>“</strong></span><strong>хормонът на съня</strong><span><strong>”</strong>, е вещество, което по своята химична природа представлява индоламин. Индоламините са група от сходни съединения, изпълняващи ролята на невротрансмитери в ЦНС.</span></p>
<p dir="ltr"><span>Мелатонинът при гръбначните животни, в това число и хората, изпълнява основната функция на </span><strong>регулатор на съня</strong><span><strong> </strong>и бодърстването. Отговорен е още за регулиране на кръвното налягане и ритмичните сезонни промени при животните.</span></p>
<p dir="ltr"><span>Упражнява по-голямата част от своите функции чрез активиране на специфични за него рецептори, а други - чрез своята роля на антиоксидант.&nbsp;</span></p>
<p dir="ltr"><span>Мелатонинът е естествен невротрансмитер и хормон, който тялото ни произвежда.&nbsp;</span></p>
<p dir="ltr"><span>Симптомите на дефицит са свързани с </span><strong>нарушения в съня</strong><span> и циркадния ритъм. Наблюдават се най-често при хора, работещи на смени, при които е нарушен естественият биологичен часовник. Срещат се често и при възрастните хора.&nbsp;</span></p>
<p dir="ltr"><span>В случай на недостиг, мелатонинът се приема като</span><span> <strong>хранителна добавка</strong> </span><span>под формата на таблетки, капки или спрей.</span></p>
<h2 dir="ltr"><span>Интересни факти за мелатонина</span></h2>
<div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/psihichno-zdrave._480x480.webp?v=1704461972" alt="факти за мелатонин спрей" style="margin-bottom: 16px; float: none;"></div>
<p dir="ltr"><span>Произходът на думата мелатонин има гръцки корени и означава “мелас” - черен и “тонос”- потискам.&nbsp;</span></p>
<p dir="ltr"><span>Мелатонинът получава това име във връзка с механизма си на действие, чрез което е открит за първи път. През 1917 година, учените К. П. МакКорд и Ф. П. Алън откриват, че захранването на попови лъжички с екстракт от епифизна жлеза на говеда води до изсветляване на цвета им чрез контрациране на тъмните епидермални меланофори.</span></p>
<p dir="ltr"><span>Ефектът да “избелва” кожата е доказан и при хората, а по-късно е установен и връзката му при</span><span> <strong>регулиране на циркадния ритъм</strong></span><strong>.</strong></p>
<p dir="ltr"><span>Мелатонинът е светлинно зависим хормон. Той се произвежда през нощта, когато няма източници на светлина, в малка ендокринна жлеза, наречена </span><strong>епифиза</strong><span><strong>.</strong> Тя е разположена в централната част на мозъка, но извън кръвно-мозъчната бариера.</span></p>
<p dir="ltr"><span>Производството на този хормон става под контрола на супрахиазматичните ядра, които получават информация за </span><strong>светлина/мрак</strong><span><strong> </strong>от ретиналните фоточувствителни ганглийни клетки. Те са разположени в окото.</span></p>
<p dir="ltr"><span>Мелатонинът стимулира активността на нощните животни, докато при дневно-активните </span><strong>стимулира съня</strong><span> и процеса на заспиване.</span></p>
<p dir="ltr"><span>В животинското царство, мелатонинът оказва влияние върху размножителните периоди и хормоналните промени, които настъпват през това време. Стимулират или потискат либидото, регулират смяната на козината и други.</span></p>
<p dir="ltr"><span>При хората, мелатонинът контролира обмяната на веществата чрез понижаване на лептина </span><strong>през нощта.</strong></p>
<h2 dir="ltr"><span>Биологичен синтез</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-prilojenie._480x480.webp?v=1708508396" alt="приложение на валериана в мелатонин спрей" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-prilojenie._480x480.webp?v=1708508396"></span></span></p>
<p dir="ltr"><span>Процесът на </span><span><strong>производство на мелатонин</strong> </span><span>включва поредица от биохимични реакции.&nbsp;</span></p>
<p dir="ltr"><span>Основен прекурсор на мелатонина, както и на други невротрансмитери (серотонин и други), е аминокиселината L-триптофан. Тази аминокиселина е незаменима за човешкия организъм и ние се сдобиваме с нея чрез храната при процеса на белтъчното разграждане.</span></p>
<p dir="ltr"><span>След това, индоловият пръстен в строежа на триптофана претърпява процес на хидроксилиране от ензим, наречен триптофан хидроксилаза, като се получава 5-хидрокситриптофан (5- HTP). 5-HTP е прекурсор както на мелатонин, така и серотонин.</span></p>
<p dir="ltr"><span>5-HTP след това е подложен на декарбоксилация от пиридоксал фосфат и 5-хидрокситриптофан декарбоксилаза до получаване на серотонин.</span></p>
<p dir="ltr"><span>В зависимост от периода на </span><span><strong>денонощието</strong> </span><span>и нуждите на организма, серотининът може да започне да изпълнява специфичните си нужди или да се превърне в N-ацетилсеротонин с помощта на серотонин N- ацетилтрансфераза и ацетил-КоА.</span></p>
<p dir="ltr"><span>След претърпяване на процес на метилация на хидроксилната група на ацетилсеротонина от хидроксииндол О-метилтрансферазата и S-аденозил метионин, той се превръща в мелатонин.</span></p>
<p dir="ltr"><span>Химическото наименование на мелатонина е</span><span> <strong>N-ацетил- 5-метокситриптамин</strong></span><strong>.</strong></p>
<h2 dir="ltr"><span>Регулация и ритмичност в отделянето на мелатонин</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011" alt="мелатонин спрей при безсъние" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/za-po-dobur-sun_480x480.webp?v=1705394011"></span></span></p>
<p dir="ltr"><span>Отделянето на мелатонин е ритмичен процес, свързан с </span><strong>бодърстването и съня</strong><span>, деня и нощта.</span></p>
<p dir="ltr"><span>Представлява изцяло хормонален сигнал, обусловен от наличието на светлина и независим от поведенчески фактори. Регулира се от отделянето на норепинефрин от симпатиковите нервни влакна единствено през нощта.</span></p>
<p dir="ltr"><span>Норепинефринът повишава нивата на цикличния аденозин монофосфат (cAMP) посредством бета-адренергични рецептори и активира ензим, наречен cAMP-зависима протеин киназа А. Този биохимичен път е решаващ за регулацията на ензима арилалкаламин-N-ацетилтрансферазата (ААNAT), който е от голямо значение за </span><strong>синтеза на мелатонин</strong><span>.</span></p>
<p dir="ltr"><span>През деня, при наличието на светлинен стимул и липса на норепинефринна стимулация, този протеин бързо се разрушава от протеозомални протеази и по този начин синтезът на мелатонин се инхибира.</span></p>
<p dir="ltr"><span>През нощта повишаването на норадреналина води до натрупване на cAMP, което от своя страна увеличава синтеза на AANAT и сигнализира на епифизната ни жлеза да започне </span><strong>отделянето на мелатонин</strong><span>. Този процес се инхибира от наличието на светлина.</span></p>
<h2 dir="ltr"><span>Ползи от мелатонина за човешкия организъм&nbsp;</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_sprei_infografika_480x480.webp?v=1702624787" alt="мелатонин спрей инфографика" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin_sprei_infografika_480x480.webp?v=1702624787"></span></span></p>
<p dir="ltr"><span>Основната </span><span><strong>функция на мелатонина</strong> </span><span>е регулацията на циркадния ритъм и режима бодърстване-сън чрез редица сложни биохимични и биофизични реакции.</span></p>
<p dir="ltr"><span>При новородените, нивата на мелатонин се нормализират и стават постоянни до към тримесечна възраст, като са най-високи от полунощ до 8 часа сутринта.</span></p>
<p dir="ltr"><span>С навлизането в тийнейджърските години, отделянето на мелатонин започва по-късно вечерта, което води до по-късно заспиване и по-продължителен сън.</span></p>
<p dir="ltr"><span>Напредването на възрастта има обратно-пропорционална зависимост с процесите на </span><strong>мелатонинова секреция</strong><span>. Възрастните хора отделят малки количества от този хормон, затова и обикновено прекарват много по-малко време в сън.</span></p>
<p dir="ltr"><span>Клинични проучвания доказват, че при хора с намалено производство или заболявания, при които се наблюдава </span><strong>дефицит на мелатонина</strong><span>, има полза от приема му под формата на хранителна добавка като таблетки, капсули или спрей.</span></p>
<h3 dir="ltr"><span>Ползи от мелатонина като антиоксидант</span></h3>
<p><span><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="мелатонин спрей антиоксидант от витаон" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/antioksidantno-deistvie-bilki._480x480.webp?v=1710831875" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/antioksidantno-deistvie-bilki._480x480.webp?v=1710831875" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
<p dir="ltr"><span>Мелатонинът притежава функцията на мощен антиоксидант. Тази негова функция е доказана през 1993 година.</span></p>
<p dir="ltr"><span>Той участва активно при неутрализирането на свободни кислородни и азотни радикали, като също доказано води до повишаване активността на редица антиоксидантни ензими.</span></p>
<p dir="ltr"><strong>Антиоксидантните качества на мелатонина</strong><span> го правят добър в протекцията срещу липидната оксидация, като стабилизира биологичните мембрани. Ефективен е срещу действието на йонизиращата радиация, отравяне с тежки метали и неутрализиране на отпадни продукти от метаболизма на лекарствени препарати.</span></p>
<p dir="ltr"><span>Доказано е, че този хормон предпазва ДНК от оксидативния стрес, както и клетъчните протеини.&nbsp;</span></p>
<p dir="ltr"><span>При нарушаване на кода на ДНК в следствие силния оксидативен стрес започват да се произвеждат нефункционални протеини или такива с вредно действие. Следствие на това се повишава вероятността от появата на онкологични заболявания и аномалии.</span></p>
<p dir="ltr"><span>Мелатонинът проявява способност да модулира редокс-чувствителни мишени, чиито структури и функции биват нарушавани дори при минимално изложение на оксидативен стрес, и реагира дори при действието на суб-оксидативни стимули.</span></p>
<p dir="ltr"><span>Мелатонинът демонстрира синергистично действие с другите </span><strong>антиоксиданти</strong><span><strong> </strong>като витамин C, провитамин А и токофероли като витамин Е и полифенолни органични съединения.</span></p>
<p dir="ltr"><span>Приемът на мелатонин се свързва с повишен антиоксидантен капацитет на плазмата. Няколко метаболита от </span><strong>обмяната на мелатонина</strong><span> също показват антиоксидантен потенциал.</span></p>
<h3 dir="ltr"><span>Ползи от мелатонина против стареене</span></h3>
<p><span><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-anti-age_480x480.webp?v=1708513347" alt="мелатонин спрей валериана анти ейдж" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei-anti-age_480x480.webp?v=1708513347"></span></p>
<p dir="ltr"><span>Установено е, че с напредване на процесите на стареене, се наблюдават </span><strong>нарушения в синтеза на мелатонин</strong><span><strong>.</strong> Количествените и качествените промени са строго индивидуални, но намаляването на нивата на мелатонин и неговите метаболити се установяват предимно в конкретни области на тялото ни.</span></p>
<p dir="ltr"><span>Спада в нивата му се свързва с различни невровегетативни заболявания, като например болестта на Алцхаймер и различните форми на старческа деменция. Те са следствие от нарушаване функционалността и структурата на супрахиазматичното ядро, нарушено невронално предаване в епифизата, както и формиране на калцификати в жлезата.&nbsp;</span></p>
<p dir="ltr"><span>В заключение науката приема, че мелатонинът може да е от полза в лечението на патологични състояния, свързани със </span><strong>стареенето</strong><span><strong>.</strong> Добавянето му с цел компенсиране на настъпилите липси би могло да възстанови нормалната хомеостаза на организма.</span></p>
<p dir="ltr"><span>Известно е още, че мелатонинът инхибира процесите на вътрешна апоптоза (клетъчна смърт), които са ускорени при невровегетативни заболявания като болест на Паркинсон, амиотрофична латерална склероза и други.</span></p>
<p dir="ltr"><span>Ранното прилагане на</span><span> <strong>мелатонин при болестта</strong></span><span> на Алцхаймер едновременно намалява увредите, причинени от оксидативния стрес, и намалява акумулацията на амилоидни телца.</span></p>
<div style="text-align: left;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-pri-alchaimer-i-parkinson_480x480.webp?v=1708068377" alt="Мелатонин при болест алцхаймер" style="margin-bottom: 16px; float: none;"></div>
<p dir="ltr"><span>При всички невродегенеративни заболявания се наблюдават поведенчески промени, които са следствие от невроналната увреда. </span><span><strong>Приемът на мелатонин</strong> </span><span>може да стабилизира тези състояния, като предпазва от настъпване на дисфункция на холинергичната система. В нея водещ невротрансмитер е ацетилхолинът.</span></p>
<p dir="ltr"><span>При започната навреме терапия още в първите етапи от клиничната изява на болестта на Алцхаймер, този хормон може да забави нейното развитие и да намали симптоматиката.&nbsp;</span></p>
<p dir="ltr"><span>По-голямата част от невропротективните свойства и </span><span><strong>anti-aging ефекта на мелатонина</strong> </span><span>се дължат на мощните антиоксидантни свойства на този индоламин. Те оказват благоприятен ефект при лечение на такъв тип заболявания на централната нервна система. Понижават степента на апоптозата, намаляват пероксидацията на мазнините, предизвикана от бета-амилоидния белтък и повишават капацитета на ДНК да се възстановява.</span></p>
<h3 dir="ltr"><span>Ползи от мелатонина за черния дроб</span></h3>
<p><span><img loading="lazy" width="480" height="480" decoding="async" style="margin-bottom: 16px; float: none;" alt="мелатонин спрей предпазва черния дроб" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-za-cherniya-drob-vitaon._480x480.webp?v=1710851098" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-za-cherniya-drob-vitaon._480x480.webp?v=1710851098" data-mce-style="margin-bottom: 16px; float: none;"></span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-e338a1dc-7fff-6185-7ffb-20405d2427b1"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Мелатонинът се съдържа в множество растителни видове, в които изпълнява различни функции. </span><strong>Ползите за човешкото тяло</strong><span> от неговия прием са доказани при редица състояния.</span></p>
<p dir="ltr"><span>Интересен факт е, че въпреки че се нарича хормон на съня, мелатонинът се съдържа и в големи дози в кафето - напитка, която от векове се използва за </span><strong>справяне с умората</strong><span>, сънливостта и за повишаване на умствения и физическия капацитет на тялото.</span></p>
<p dir="ltr"><span>Затова и някои хора съобщават, че след приема на кафе всъщност стават </span><strong>сънливи</strong><span>, вместо ободрени.</span></p>
<p dir="ltr"><span>Приемът на кафе, благодарение на съдържанието му на мелатонин, както и други </span><a href="https://vitaon.bg/collections/antioksidanti" data-mce-href="https://vitaon.bg/collections/antioksidanti"><span>природни антиоксиданти</span></a><span>, оказва хепатопротективен ефект върху черния дроб. Тези ефекти са демонстрирани при чернодробни заболявания като фиброза, стеатохепатит и цироза, вследствие на отравяне с въглероден тетрахлорид.</span></p>
<p dir="ltr"><span>Редица други проучвания потвърждават ползите от приема на този индоламин за запазване на </span><strong>чернодробната функция.</strong></p>
<h3 dir="ltr"><span>Ползи от мелатонина за сърцето</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="сърдечно съдова система мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/kardiologichen-efekt_480x480.webp?v=1704799765" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/kardiologichen-efekt_480x480.webp?v=1704799765"></span></span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-a9e35a50-7fff-7fd6-f643-01cd9bc77cd2"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Позитивни ефекти от допълнителен прием на мелатонин или от повишени плазмени нива се наблюдават и върху </span><strong>сърдечно-съдовата система.</strong></p>
<p dir="ltr"><span>Всеизвестен факт е, че приемът на червено вино има защитно действие при сърдечни заболявания. Една от причините е, че червеното вино инхибира </span><strong>мелатониновия рецептор</strong><span>, като по този начин увеличава концентрацията на свободноциркулиращия хормон в кръвта.</span></p>
<p dir="ltr"><span>Приемът на </span><span><strong>мелатонин като добавка</strong> </span><span>или чрез храни води до редукция на хипертрофията на дясната камера, подобрена помпена функция и намалена сърдечна интерстициална фиброза.</span></p>
<h3 dir="ltr"><span>Ползи от мелатонина като средство за борба с ракови клетки</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="анти-раково действие валериана" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/protivorakovo-deistvie-bilkova-tinktura_480x480.webp?v=1708067786" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/protivorakovo-deistvie-bilkova-tinktura_480x480.webp?v=1708067786"></span></span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-ec7acad3-7fff-9413-f48a-70cc9114f2d1"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Редица проучвания показват, че мелатонинът може да има роля като </span><strong>противораково средство</strong><span>. Доказана е обратнопропорционална връзка между някои онкологични заболявания и нивата на </span><span><strong>серумния мелатонин</strong> </span><span>и експресията на мелатониновия рецептор.</span></p>
<p dir="ltr"><span>Антипролиферативната активност (т.е. възможността да потиска деленето на злокачествените клетки) е установена срещу няколко популации от туморни клетки.</span></p>
<p dir="ltr"><strong>Тези популации включват:</strong></p>
<ul>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Рак на гърдата</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Дебелочревен карцином</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Вагинален</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Ендометриален</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Белодробен</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Панкреатичен</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Простатен</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Бъбречен</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Тестикулярен и други.</span></p>
</li>
</ul>
<p dir="ltr"><strong>Действието на мелатонина</strong><span> е свързано със способността му да намалява повредите на ДНК, да повишава активността на други антиоксидантни ензими и да регулира експресията на конкретни онкогени. В експериментални проучвания, този хормон работи синергистично с редица химиотерапевтици.</span></p>
<p dir="ltr"><span><strong>Ролята на мелатонина</strong> </span><span>при превенция и профилактика на раковите заболявания е доказана косвено, като е установено, че честотата на някои специфични ракови заболявания е значително по-висока при определени групи от хора.&nbsp;</span></p>
<p dir="ltr"><span>Сходното между всички тях е </span><span><strong>нарушеният циркаден ритъм</strong> </span><span>и излагането на светлина през нощта. По този начин </span><strong>биологичният ритъм</strong><span> на пикове и спадове в серумните нива на мелатонина е напълно объркан и той не може да изпълнява регулаторните си функции.&nbsp;</span></p>
<p dir="ltr"><span><strong>Това е предпоставка за</strong>:</span></p>
<ul>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Многократно повишен оксидативен стрес</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Нарушен имунологичен отговор към стресори</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Повишена пролиферация и намалена апоптоза на клетки с дефектирала ДНК- спирала и други.</span></p>
</li>
</ul>
<h2 dir="ltr"><span>Мента (Mentha Piperita)</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей билка мента" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-melatonin-sprei_480x480.webp?v=1708514605" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-melatonin-sprei_480x480.webp?v=1708514605"></span></span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-eddc9d89-7fff-ae15-0b58-62973b6fe26e"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Ментата (mentha piperita) e зелено храстовидно растение, член на семейство Lamiaceae. Известно още като семейството на </span><strong>ментата</strong><span>, то включва голям брой ароматни билки, в това число босилек, розмарин, риган и джоджен.</span></p>
<p dir="ltr"><span>Представлява ниско многогодишно растение, което има широк ареал на разпространение. Обича да обитава влажни и немного слънчеви места, най-често около реки, естествени и изкуствени водоеми.</span></p>
<h3 dir="ltr"><span>Активни вещества на ментата</span></h3>
<p dir="ltr"><span>Ментата представлява ароматна билка, която е известна с етеричните си масла. Те се извличат чрез алкохолна дестилация на листната маса на растението.</span></p>
<p dir="ltr"><span>Периодът, в който се берат листата на билката с цел екстракция на ароматното масло, е в началото на фазата на цъфтежа. Тогава маслото е най-богато на </span><strong>активни вещества</strong><span>. </span><strong>Екстрактът от мента</strong><span> се стандартизира и по норматив трябва да съдържа не по-малко от 44% ментол, 15-30% ментон, 5% естери и множество терпеноиди.&nbsp;</span></p>
<p dir="ltr"><strong>Съдържа още:</strong></p>
<ul>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Флавоноиди (до 12%)</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Полифеноли</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Каротени</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Токоферол</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Холин</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Бетаин.&nbsp;</span></p>
</li>
</ul>
<p dir="ltr"><span>Етеричното масло от мента съдържа терпеноидите алфа-пинин и бета-пинин, алфа- феландрен и също естери на оцетна и изовалерична киселина. Последните две съединения са отговорни за силното </span><strong>антимикробно действие</strong><span> на ментата.</span></p>
<p dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мента за стомашни болки" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-za-stomashni-bolki_480x480.webp?v=1708515209" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/menta-za-stomashni-bolki_480x480.webp?v=1708515209"></span></span></p>
<p dir="ltr"><span>Ментата и ментовото масло намират широко приложение както в хранителната, така и във фармацевтичната индустрия. Тя има множество </span><strong>полезни качества</strong><span> и затова се използва широко в народната и традиционната медицина.</span><span></span></p>
<p dir="ltr"><strong>Помага при различни състояния като:</strong></p>
<ul>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Горещи вълни при жени, на които предстои менопауза</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Синдром на дразнимото дебело черво (колон иритабиле)</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Инфекции с вируса херпес симплекс</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Състояния на тревожност и безпокойство</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Психически натоварвания</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Гадене и лошо храносмилане.</span></p>
</li>
</ul>
<h3 dir="ltr"><span>Ползи от ментата върху нервната система</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей мента за успокоение" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/stres-naprejenie-vitaon.._480x480.webp?v=1707830065" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/stres-naprejenie-vitaon.._480x480.webp?v=1707830065"></span></span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-4b064c21-7fff-c966-d883-58372272fea6"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Ментата от години се използва в традиционната и народната медицина заради нейния </span><strong>успокояващ ефект</strong><span>. Етеричните ѝ масла успокояват мозъка и помагат за постигане на състояние на релакс.&nbsp;</span></p>
<p dir="ltr"><span>Приемът на ментов</span><span> <strong>екстракт преди лягане</strong></span><span> допринасят за по-бързото “изключване” на мисловните процеси като така допринася за по-бързото заспиване.</span></p>
<p dir="ltr"><span>Приет през деня, екстрактът от мента стимулира отделянето на серотинин и помага за </span><a href="https://vitaon.bg/collections/dobavki-stres-depresiya" data-mce-href="https://vitaon.bg/collections/dobavki-stres-depresiya"><span>подобряване на настроението</span></a><span>, премахва тревожността и помага при състояния на лека субклинична депресия.</span></p>
<h3 dir="ltr"><span>Други ползи от приема на мента за човешкия организъм</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мента при гадене" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-protiv-gadene-i-povrashtane._480x480.webp?v=1707917604" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/bilkova-tinktura-protiv-gadene-i-povrashtane._480x480.webp?v=1707917604"></span></span></p>
<p dir="ltr"><span>Ментата е ефективна за облекчаване на различни симптоми, свързани със стомашно-чревния тракт, спазми, подуване на корема. Подобрява храносмилането. Облекчава възпалителни състояния на чревната и стомашната лигавица.</span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-9b691fc7-7fff-e06e-ce48-07850ff59e0a"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Ментата притежава и аналгетични свойства или казано по друг начин - има </span><strong>обезболяващ ефект</strong><span><strong>.</strong> Той се медиира посредством активацията на к-опиоидния рецептор, като се блокира предаването на болкови сигнали.</span></p>
<p dir="ltr"><span>Доказателство за ефектите на ментата при лечение на колон иритабиле дава и проучване на Кохрейн от 2006 година, който потвърждава, че 79% от пациентите с това заболяване съобщават за сигнификантно редуциране на болковата симптоматика след 2 седмичен прием на</span><span> </span><a href="https://vitaon.bg/collections/bilkovi-tinkturi" data-mce-href="https://vitaon.bg/collections/bilkovi-tinkturi"><span>екстракт от билката</span></a><span>.&nbsp;</span></p>
<p dir="ltr"><span>Поради сходство в рецепторите, които се експресират в целия гастроинтестинален тракт, ментовия екстракт изразява антиспазматично действие при жлъчни колики, чревни колики, стомашни крампи. Повлиява също и гладката мускулатура на матката, като жените благоприятстват от този ефект по време на </span><strong>болезнен цикъл.</strong></p>
<h2 dir="ltr"><span>Валериана (Valeriana Officianalis)</span></h2>
<h2 dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="валериана мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei._480x480.webp?v=1708508248" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-melatonin-sprei._480x480.webp?v=1708508248"></span>&nbsp;</span></h2>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-541a0ad7-7fff-f9cd-af90-dfdcf4aeaef1"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Валериана, или още </span><strong>лечебна дилянка</strong><span>, е многогодишно цъфтящо растение, произхождащо от Европа и Азия. Латинското му наименование е Valeriana Officinalis.&nbsp;</span></p>
<p dir="ltr"><span>Известно още от дълбока древност, поне от времето на древните гърци и римляни, това растение се е използвало широко в народната медицина. Хипократ и Гален описват неговите качества като </span><strong>успокоително средство</strong><span> и са го предписвали на </span><strong>страдащите от безсъние.&nbsp;</strong></p>
<p dir="ltr"><span>В настоящето, коренът на растението влиза най-често в употреба, като от него се приготвя екстракт. Той притежава успокоителен ефект и премахва тревожността.</span></p>
<p dir="ltr"><span>Съдържанието на екстракта от валериана е изключително богато по състав на активни химически вещества. Някои от тях са изучени и действието им е доказано и познато, а друга част от тях са все още в процес на проучване.</span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-26cc986f-7fff-1d6c-471f-8f2754666757"></b><meta charset="utf-8"></b></span></span></span></p>
<h3 dir="ltr"><span>Активни вещества в екстракта от валериана</span></h3>
<p dir="ltr"><span>Коренът на валериана е изключително богат на активни вещества, разделени в няколко групи.</span></p>
<p dir="ltr"><strong>Тези групи включват:</strong></p>
<ul>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Алкалоиди - актинидин, хатинин, шиантин, валерин и валерианин</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Изовалерамиди</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Гама-аминобутарат (GABA)</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Изовалерианова киселина</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Иридоиди, включително валепотриати: изовалтарат и валтарат</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Сескитерпени - валеренова киселина, хидроксивалеренова киселина и ацетоксивалеренова киселина</span></p>
</li>
<li aria-level="1" dir="ltr">
<p role="presentation" dir="ltr"><span>Флавонони - хесперидин, 6-метилапигенин и линарин</span></p>
</li>
</ul>
<h3 dir="ltr"><span>Ползи от валериана, подпомагащи действието на Мелатонин спрей</span></h3>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-5d4a3d0e-7fff-35bf-7758-a392b1718062"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>Валерианата е добре проучена </span><strong>билка</strong><span><strong>.</strong> За науката е наясно, че зад нейните ползи, свързани със </span><span><strong>съня и успокоението</strong> </span><span>на организма, стоят конкретни вещества, принадлежащи към някои от изброените по-горе групи. Това са веществата изовалерамид и валеренова киселина.</span></p>
<h3 dir="ltr"><span>Ползи от Изовалерамид за съня и нервната система</span></h3>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="мелатонин спрей биоанализ" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-biosintez_480x480.webp?v=1708516924" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-biosintez_480x480.webp?v=1708516924"></span></span></p>
<p dir="ltr"><span>Изовалерамид е органично съединиение, производно на изовалериановата киселина. Съдържа се именно в екстракта от корена на растението. Действието му в малки дози е да </span><strong>намалява тревожността</strong><span>, а в по-големи дози може да действа като </span><strong>слабо приспивателно.</strong></p>
<p dir="ltr"><span>Това вещество е активно в ЦНС и преминава кръвно-мозъчната бариера.</span></p>
<p dir="ltr"><span>Представлява позитивен алостеричен модулатор на GABAa рецептора. Това означава, че се свързва с друг алостеричен център на рецептора, като потенциира и усилва действието на основния лиганд, в случая - Гама-аминобутиричната киселина.</span></p>
<p dir="ltr"><span>Тя има депресивно действие върху ЦНС и е важна за процесите на заспиване. По този начин изовалеричната киселина доказано води до </span><strong>по-бързо заспиване</strong><span><strong> и </strong></span><strong>по-дълъг и качествен сън.</strong></p>
<p dir="ltr"><span>Интересното за нея е, че блокира ензима, който преработва алкохола, а именно алкохолната дехидрогеназа. Тази особеност е важна и трябва да се има предвид при консумацията на алкохол и приема на мелатонин спрей или други продукти, съдържащи валериана.</span></p>
<h3 dir="ltr"><span>Валеренова киселина</span></h3>
<p dir="ltr"><span>Тази органична киселина представлява съединение от групата на сесквитерпените. Тя е една от основните съставки на етеричното масло от валериана.</span></p>
<p dir="ltr"><span>Валериана се използва от дълбока древност като </span><strong>естествено успокоително</strong><span> и </span><strong>приспивателно средство</strong><span>, което освен на изовалерамида се дължи именно на валериановата киселина.</span></p>
<p dir="ltr"><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" alt="валериана при безсъние мелатонин спрей" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-pri-bezsanie-melatonin-sprei_480x480.webp?v=1708515422" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/valeriana-pri-bezsanie-melatonin-sprei_480x480.webp?v=1708515422"></span></span></p>
<p dir="ltr"><span>Други две киселини, сходни на валероновата - хидроксивалеронова и ацетоксивалеронова, също допринасят за тези свойства на билката. Често </span><a href="https://vitaon.bg/collections/hranitelni-dobavki" data-mce-href="https://vitaon.bg/collections/hranitelni-dobavki"><span>хранителните добавки и екстракти</span></a><span> </span><span>от корен на валериана са стандартизирани да съдържат определено количество валеронова киселина (обикновено 0,8% от теглото).</span></p>
<p dir="ltr"><span>Валероновата кис</span><span>елина действа като подтип-селективен GABA рецепторен позитивен алостеричен модулатор, като отново засилва действието на гама- аминобутиричната киселина.&nbsp;</span></p>
<p dir="ltr"><span>Тази киселина се свърза също и с друг рецептор, този път серотонинов. Става дума за 5-НТ. Валероновата киселина при свързването си с този рецептор действа като частичен агонист (тоест подсилва действието на веществото).</span></p>
<p dir="ltr"><span>За разлика от GABA-рецептора, който стриктно регулира трансмисията само на гама-аминобутиричната киселина, серотониновият рецептор има регулаторно действие върху редица други </span><strong>невротрансмитери.</strong></p>
<p dir="ltr"><span>Той също участва в механизмите за регулиране на цикъла сън-бодърстване. Именно затова валероновата киселина оказва </span><strong>седативно и успокоително действие</strong><span>, действайки върху два рецептора, отговорни за сходни функции и процеси.</span></p>
<h2 dir="ltr"><span>Какви са предимствата на Мелатонин спрей на ВитаОн?</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-polzi...._480x480.webp?v=1708505896" alt="мелатонин спрей ползи заключение" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/melatonin-sprei-polzi...._480x480.webp?v=1708505896"></span></span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-819f2f0a-7fff-55e0-74b6-aecacb2de468"></b><meta charset="utf-8"></b></span></span></span></p>
<p dir="ltr"><span>В нашия продукт, ние внимателно сме подбрали съставките, за да действат абсолютно синергично в мисията си да ви дарят с един </span><strong>дълъг, качествен, истински релаксиращ сън.</strong></p>
<p dir="ltr"><span>Подбрали сме </span><strong>течна форма</strong><span> и на трите съставки, които се допълват в своето действие. Това ви дава предимството на по-бързо и лесно усвояване и съответно - по-бързо настъпване на желаните ефекти.</span></p>
<p dir="ltr"><span>Нашият продукт ще е вашето средство да се справяте с натовареното ежедневие, защото ще осигури един </span><strong>дълбок и пълноценен сън</strong><span>. Приемът му гарантира поддържане на оптимални енергийни нива през целия ден и чувство на благоденствие.</span></p>
<p dir="ltr"><span>За ваше улеснение ние предлагаме формула, която се прилага под </span><strong>формата на спрей</strong><span> в устната кухина. За неговото създаване сме използвали само премиум екстракти от билките мента и валериана.</span></p>
<h2 dir="ltr"><span>Често задавани въпроси</span></h2>
<p><span><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><img loading="lazy" width="480" height="480" decoding="async" src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243" alt="въпроси за мелатонин спрей" data-mce-src="https://cdn.shopify.com/s/files/1/0779/3383/8663/files/chesto-zadavani-vuprosi._480x480.webp?v=1705409243"></span></span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b><b id="docs-internal-guid-633e42ca-7fff-6d05-fce7-d66ae72628e2"></b><meta charset="utf-8"></b></span></span></span></p>
<h3 dir="ltr"><span>Подходящ ли е мелатонинът за деца?</span></h3>
<p dir="ltr"><span>Не, детският организъм има доста по-добра регулация на процесите сън-бодърстване от този на възрастен човек. Спазването на режим на лягане и ставане в един и същи час до голяма степен оптимизира нивата на мелатонин при децата.&nbsp;</span></p>
<h3 dir="ltr"><span>Работи ли наистина спреят за сън с мелатонин?</span></h3>
<p dir="ltr"><span>Да, спреят за сън с мелатонин помага за по-бързо релаксиране и заспиване. Освен това, в дългосрочен план, суплементацията с мелатонин води до редица други ползи за нашето здраве, особено що се касае за нервната ни система.</span></p>
<h3 dir="ltr"><span>Колко бързо действа спреят с мелатонин?</span></h3>
<p dir="ltr"><span>При пръскане на спрей под езика, при условие на загасени светлини и отстраняване на дразнителите, продуктът оказва действие за около 10-15 минути.</span></p>
<h3 dir="ltr"><span>Как да приемам мелатонин спрей за сън?</span></h3>
<p dir="ltr"><span>Най-добре е да се приема при пълна подготовка за сън - когато сме легнали в покой, загасили сме светлините и сме отстранили възможните звукови и светлинни дразнители.</span></p>
<p><span style="font-weight: 400;" data-mce-style="font-weight: 400;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><span style="vertical-align: inherit;" data-mce-style="vertical-align: inherit;"><b id="docs-internal-guid-7280d09f-7fff-fa51-f32b-4cba486e070e"></b></span></span></span></p>
<ul></ul>



</div>`

  try {
    for (let i = 0; i < count; i++) {
      await client.query({
        data: {
          query: CREATE_PRODUCTS_MUTATION,
          variables: {
            input: {
              title: `${randomTitle()}`,
              descriptionHtml: htmlString,
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
      mutation UpdateProduct($id: ID!, $descriptionHtml: String!, $metafieldToc: String!) {
        productUpdate(
          input: {
            id: $id,
            descriptionHtml: $descriptionHtml,
            metafields: [
              {
                key: "toc",
                namespace: "custom",
                value: $metafieldToc,
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

    if (products.length > 0) {
      const productsWithoutToc = products.filter((product) => !product.isTocGenerated);
      for (const product of productsWithoutToc) {
        const descriptionHtml = product.descriptionHtml;
        const toc = createToc(descriptionHtml);
        const productDescription = createProductDescription(descriptionHtml);

        const response = await client.query({
          data: {
            query: UPDATE_PRODUCT_MUTATION,
            variables: {
              id: `gid://shopify/Product/${product.id}`,
              descriptionHtml: `${productDescription}`,
              metafieldToc: toc.tocHtml
            },
          },
        });

        // Check for user errors in the response
        if (response.body.data.productUpdate.userErrors.length > 0) {
          throw new Error(
            `Failed to update product ${product.id}: ${response.body.data.productUpdate.userErrors.map((error) => error.message).join(", ")}`
          );
        }

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

  const toc = createToc(productDescription);
  const generateProductDescription =
    createProductDescription(productDescription);

  try {
    const response = await client.query({
      data: {
        query: GENERATE_TOC_FOR_PRODUCT_MUTATION,
        variables: {
          id: `gid://shopify/Product/${gid}`,
          descriptionHtml: `${generateProductDescription}`,
          metafieldToc: `${toc.tocHtml}`
        },
      },
    });

    // Check for user errors in the response
    if (response.body.data.productUpdate.userErrors.length > 0) {
      throw new Error(
        `Failed to update product ${product.id
        }: ${response.body.data.productUpdate.userErrors
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
          (metafield) => metafield.node.value != ""
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

export async function editProductToc(product_gid, product_body_html) {
  const session = {
    id: 'offline_dimitar-shop-app-test.myshopify.com',
    shop: 'dimitar-shop-app-test.myshopify.com',
    state: '740419230191843',
    isOnline: false,
    scope: 'write_products',
    accessToken: 'shpua_ef480e93938516d6e006c66d234bcae4'
  }
  const client = new shopify.api.clients.Graphql({ session: session });

  const product_info = await client.query({
    data: {
      query: GET_SINGLE_PRODUCT_QUERY,
      variables: {
        id: product_gid
      },
    },
  });

  let product_metafield_id = ''

  product_info.body.data.product.metafields.edges.some((edge) => {
    if (edge.node.key == 'toc') {
      product_metafield_id = edge.node.id
    }
  })

  const product_descriptionHtml = product_info.body.data.product.descriptionHtml
  const product_id = product_info.body.data.product.id

  if (product_metafield_id != '') {
    const toc = createToc(product_descriptionHtml);
    const generateProductDescription =
      createProductDescription(product_descriptionHtml);

    await client.query({
      data: {
        query: UPDATE_PRODUCT_HTML_AND_METAFIELD_MUTATION,
        variables: {
          id: product_id,
          descriptionHtml: `${generateProductDescription}`,
          metafieldId: product_metafield_id,
          metafieldValue: toc.tocHtml,
        },
      },
    });

    //   await client.query({
    //     data: {
    //       query: EDIT_TOC_FOR_PRODUCT_MUTATION,
    //       variables: {
    //         id: product_id,
    //         metafieldId: product_metafield_id,
    //         metafieldToc: toc.tocHtml,
    //       },
    //     },
    //   });

    //  await client.query({
    //     data: {
    //       query: EDIT_DESCRIPTION_HTML_FOR_PRODUCT_MUTATION,
    //       variables: {
    //         id: product_id,
    //         descriptionHtml: generateProductDescription,
    //       },
    //     },
    //   });
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
