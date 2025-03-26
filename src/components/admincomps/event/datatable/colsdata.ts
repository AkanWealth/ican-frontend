export interface Event {
  event_id: string;
  eventName: string;
  date: string;
  time: string;
  venue: "virtual" | string;
  meetingLink?: string;
  fee: number | string;
  mcpdCredit: "" | number;
  eventDescription?: string;
  eventImage?: string;
  status: "completed" | "cancelled" | "draft" | "upcoming";
}

export const events: Event[] = [
  {
    event_id: "67c5b720d29117eb8ec2edb4",
    eventName: "cfcbd095-9bb3-4170-ae96-c795ce1a2d11",
    date: "2022-08-14",
    time: "2022-05-02",
    venue: "Hewes Street",
    fee: "3,092.32",
    mcpdCredit: 5,
    eventDescription:
      "Sunt esse commodo laborum minim laborum exercitation anim pariatur ex excepteur. Laboris labore in aliqua ex exercitation Lorem mollit nulla mollit qui sit. Minim magna ea commodo anim incididunt aute enim. Pariatur exercitation minim Lorem labore ex cillum aliqua sunt adipisicing et ea aute culpa. Elit proident occaecat aliquip in ipsum deserunt eiusmod excepteur dolor.",
    eventImage:
      "Ea commodo ea elit in pariatur anim nostrud adipisicing ipsum nisi. Ullamco ut do aliquip aute amet commodo esse mollit cupidatat esse sint aliquip. Proident dolore velit sunt anim ullamco qui sint sit elit dolore fugiat reprehenderit consectetur consectetur.",
    status: "cancelled",
  },
  {
    event_id: "67c5b720cfadcee96a8723eb",
    eventName: "1f38883e-abde-46d9-93ea-373df1a1c9b5",
    date: "2024-08-21",
    time: "2024-03-04",
    venue: "Louisiana Avenue",
    fee: "1,990.41",
    mcpdCredit: 4,
    eventDescription:
      "Do enim ut et exercitation in amet mollit duis mollit nisi exercitation sint est. Commodo duis non in sunt magna. Consequat duis commodo dolor aute sit culpa amet fugiat aute ut. Nisi excepteur aliqua laboris qui duis laboris veniam dolor sint labore voluptate cupidatat aliquip veniam. Reprehenderit nulla id esse deserunt commodo velit enim sit commodo esse laborum.",
    eventImage:
      "Duis amet amet eu esse qui consectetur sunt eiusmod quis quis Lorem sit id ea. Ut dolore veniam excepteur id eiusmod voluptate veniam. Laborum dolore elit ad nulla qui in ullamco id sunt occaecat officia occaecat ex ut.",
    status: "completed",
  },
  {
    event_id: "67c5b72058325e84f89d4941",
    eventName: "8abaa3b3-95cb-4ad2-a55e-a423e92f76c3",
    date: "2021-08-30",
    time: "2024-01-30",
    venue: "Poplar Avenue",
    fee: "3,544.60",
    mcpdCredit: 4,
    eventDescription:
      "Mollit nostrud anim sit deserunt tempor consectetur. Incididunt cupidatat proident Lorem nulla dolore in proident velit consequat Lorem anim. Aute quis aute magna fugiat mollit occaecat nulla aute cillum id exercitation. Reprehenderit aute magna aliquip aute sint ipsum officia veniam et reprehenderit Lorem ea consectetur consequat. Occaecat ex eiusmod ipsum sunt voluptate eu voluptate.",
    eventImage:
      "Nisi non in mollit nulla id. Ipsum aute duis eu dolor veniam ullamco laboris ad. Ullamco mollit laboris labore aute elit laborum veniam deserunt incididunt officia tempor aute.",
    status: "cancelled",
  },
  {
    event_id: "67c5b7209985e6c47afd9f29",
    eventName: "c243eda4-f945-4212-98cc-d537a57a5ce7",
    date: "2022-01-15",
    time: "2015-03-03",
    venue: "Ferry Place",
    fee: "1,428.41",
    mcpdCredit: 5,
    eventDescription:
      "Adipisicing voluptate dolor ullamco labore occaecat proident ea fugiat nostrud sit voluptate non ullamco magna. Cupidatat cillum ea consectetur commodo eu est ullamco et reprehenderit nulla anim fugiat velit. Aliquip adipisicing sunt id in tempor laborum duis proident anim aliquip minim. Laborum officia magna qui quis mollit aliqua quis mollit aute excepteur sit consectetur proident sint. Non fugiat sint ut nulla labore laborum veniam enim sint excepteur ut nulla enim.",
    eventImage:
      "Lorem sit cupidatat ea ipsum cillum aliqua culpa culpa velit. Voluptate et consequat mollit ipsum labore dolore eu aliqua. Velit minim laborum duis excepteur ullamco veniam est mollit nostrud.",
    status: "upcoming",
  },
  {
    event_id: "67c5b72042216b3c94339284",
    eventName: "6233f619-fd0b-4665-80b4-0fb992b15c76",
    date: "2019-01-06",
    time: "2016-12-03",
    venue: "Cornelia Street",
    fee: "2,902.80",
    mcpdCredit: 9,
    eventDescription:
      "Lorem quis do cupidatat commodo ullamco fugiat sint laboris ullamco officia sint sit. Officia aute consequat pariatur deserunt nostrud nisi consectetur occaecat nostrud ad. Incididunt consectetur cillum excepteur esse id. Adipisicing veniam esse consequat esse dolore consequat. Consectetur deserunt culpa quis qui fugiat ipsum aliqua eu cupidatat.",
    eventImage:
      "Adipisicing commodo dolore sunt pariatur fugiat adipisicing excepteur ullamco. Adipisicing magna sit sit mollit dolor ipsum occaecat ullamco consectetur cillum. Velit amet eu excepteur esse laborum id elit esse nisi amet fugiat aliquip nisi ipsum.",
    status: "cancelled",
  },
  {
    event_id: "67c5b720852735a18c640018",
    eventName: "aa56e566-d686-4441-b410-3b2ea618cce1",
    date: "2021-06-01",
    time: "2024-11-01",
    venue: "Langham Street",
    fee: "3,184.02",
    mcpdCredit: 4,
    eventDescription:
      "Sunt dolor tempor amet cillum eiusmod incididunt pariatur non quis tempor do laborum qui. Laborum nulla culpa sunt aute magna ullamco cupidatat consectetur. Lorem sunt quis et esse aliqua. In ad ea commodo ipsum pariatur adipisicing in officia aliquip anim qui mollit quis. Ipsum culpa enim exercitation sit duis culpa laborum velit voluptate nisi adipisicing in.",
    eventImage:
      "Aliquip ipsum officia dolore irure duis aliquip ullamco amet exercitation excepteur cupidatat esse non occaecat. Ullamco irure ex ut tempor culpa enim do veniam consectetur officia mollit eu excepteur exercitation. Laborum ullamco amet adipisicing minim proident sunt incididunt laborum aliquip aute.",
    status: "upcoming",
  },
  {
    event_id: "67c5b720a068fe1d07887ff2",
    eventName: "7bbc9b45-d10b-454f-8fd7-200132c907a1",
    date: "2022-08-07",
    time: "2022-06-17",
    venue: "Lexington Avenue",
    fee: "3,439.37",
    mcpdCredit: 7,
    eventDescription:
      "Veniam sunt Lorem pariatur elit laboris. Cupidatat ipsum incididunt excepteur do duis laborum cupidatat duis. Ipsum dolore velit eiusmod duis esse. Pariatur do fugiat proident cupidatat consequat duis eu eiusmod minim aliqua irure. Ullamco anim non voluptate irure consequat aute.",
    eventImage:
      "Irure deserunt non dolore et nostrud proident proident duis Lorem esse. In qui nostrud enim labore cupidatat fugiat cupidatat quis mollit exercitation aute occaecat. Pariatur sunt mollit incididunt sint duis tempor qui ipsum ullamco enim occaecat et amet aliquip.",
    status: "completed",
  },
  {
    event_id: "67c5b7202e402961e52a6e0a",
    eventName: "facdb1b8-914a-4575-baa6-491b6d034572",
    date: "2022-12-21",
    time: "2022-06-25",
    venue: "Kensington Street",
    fee: "3,255.87",
    mcpdCredit: 3,
    eventDescription:
      "Officia occaecat ad aliqua fugiat ut ut non Lorem. Est quis sit duis labore in dolore duis eu sit commodo. Tempor proident duis irure consectetur mollit minim sit veniam eiusmod in mollit excepteur dolore. Sint tempor sit nulla do minim consequat sunt do elit consequat. Nulla mollit cupidatat mollit non cillum consectetur voluptate non velit nostrud cupidatat aliqua.",
    eventImage:
      "Amet ipsum reprehenderit nostrud est est aliqua laboris reprehenderit ea velit. Cupidatat exercitation aliquip laboris do ad est. Veniam ut qui labore laboris laborum aliqua ex ad cillum dolor proident tempor mollit.",
    status: "upcoming",
  },
  {
    event_id: "67c5b720d3b47030618389aa",
    eventName: "9c0b5714-40da-476d-be79-1f540e73d405",
    date: "2022-08-23",
    time: "2019-04-02",
    venue: "Channel Avenue",
    fee: "3,737.92",
    mcpdCredit: 1,
    eventDescription:
      "Est irure exercitation anim voluptate irure ea. Sint deserunt sunt ad velit pariatur. Laborum cupidatat id tempor ipsum adipisicing sunt mollit ad magna nisi ullamco laborum. Excepteur voluptate fugiat aute amet enim deserunt duis consectetur adipisicing fugiat eu proident labore veniam. Nulla reprehenderit proident excepteur reprehenderit.",
    eventImage:
      "Anim excepteur eu pariatur minim amet ad aute excepteur adipisicing enim reprehenderit consectetur. Esse velit incididunt pariatur qui. Commodo ut proident est quis aute Lorem.",
    status: "cancelled",
  },
  {
    event_id: "67c5b720226db5fc40da6149",
    eventName: "355be938-eca9-49a5-bd20-37726bbffe58",
    date: "2025-02-13",
    time: "2024-09-06",
    venue: "Eldert Street",
    fee: "2,317.19",
    mcpdCredit: 2,
    eventDescription:
      "Ut non esse quis tempor labore duis fugiat amet minim enim. Veniam et et aliquip excepteur reprehenderit est sunt cupidatat occaecat pariatur sit fugiat consectetur sunt. Sunt non ea veniam qui. Occaecat voluptate anim adipisicing proident aliqua. Culpa ex do consequat labore minim proident minim deserunt adipisicing ea dolor irure.",
    eventImage:
      "Officia cupidatat veniam Lorem sunt. Quis nisi pariatur consequat enim anim qui irure nulla tempor magna. Culpa esse qui deserunt et ex tempor proident incididunt nisi consequat aliquip labore ullamco.",
    status: "upcoming",
  },
  {
    event_id: "67c5b72047a3ce778ced0f2e",
    eventName: "8218dd8a-acd4-40b8-8d7b-af2016d645ec",
    date: "2020-04-17",
    time: "2019-01-19",
    venue: "Macdougal Street",
    fee: "1,042.68",
    mcpdCredit: 8,
    eventDescription:
      "Enim irure veniam excepteur ipsum Lorem aliqua sint elit ex et adipisicing. Minim fugiat est reprehenderit ea sint id ad do enim excepteur eu Lorem id consequat. Anim in duis id in exercitation labore laboris. Mollit culpa amet anim consectetur non fugiat ullamco minim veniam voluptate officia duis qui laborum. Excepteur eiusmod qui id consequat sunt excepteur culpa sit exercitation.",
    eventImage:
      "Velit dolor do voluptate veniam magna ad. Sit exercitation officia veniam cupidatat dolor consectetur minim dolore excepteur minim eiusmod ea amet. Cillum nostrud occaecat laborum officia ex elit nisi et enim aliquip laborum consectetur velit ea.",
    status: "draft",
  },
  {
    event_id: "67c5b720552898b9818af4a6",
    eventName: "687893c8-51bf-4171-a2f8-c59d66233406",
    date: "2015-09-02",
    time: "2022-12-27",
    venue: "Varanda Place",
    fee: "3,050.17",
    mcpdCredit: 7,
    eventDescription:
      "Culpa veniam quis ea officia minim qui veniam dolore aute ex officia incididunt proident. Quis incididunt elit culpa enim enim aliqua incididunt reprehenderit anim aliqua voluptate voluptate. Sint sint sunt adipisicing ex magna deserunt. Id ex culpa do excepteur commodo exercitation nostrud et. Ullamco laborum proident officia qui id laboris cupidatat sint occaecat et quis voluptate dolore.",
    eventImage:
      "Dolor id mollit cupidatat veniam consequat et cillum amet dolor commodo amet irure ut labore. Deserunt minim est officia cillum nostrud veniam occaecat proident. Cillum dolore consequat adipisicing non proident sunt tempor dolore exercitation et nulla quis.",
    status: "upcoming",
  },
];
