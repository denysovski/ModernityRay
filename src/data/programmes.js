/* The training programmes, and the coaches who run them.
 *
 * Same list/detail shape as courts and tiers: `slug` is the route segment, so
 * /programmes/:slug resolves straight out of this file. The homepage carousel
 * reads the short fields (title, meta, tag, desc, img); the detail view reads
 * everything else.
 *
 * Coaches are stored once in COACHES and referenced by id, because the same
 * person runs more than one programme and a name should not be typed twice.
 */
import { local, remote } from './images'
import { paths } from '../routes'

/**
 * @typedef {Object} Coach
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} img
 * @property {string} since    the year they joined the club
 * @property {string} bio      two sentences, no more
 * @property {string[]} badges short credentials
 */

/** @type {Coach[]} */
export const COACHES = [
  {
    id: 'davis',
    name: 'Davis Korsgaard',
    role: 'Head coach, tennis',
    img: remote('1472099645785-5658abf4ff4e', 400),
    since: '2026',
    bio:
      'Fourteen years on tour benches before he came here, six of them with a top-fifty singles player. ' +
      'He coaches serve mechanics the way an engineer reads a drawing — one joint at a time.',
    badges: ['PTR Professional', 'Ex-tour analyst'],
  },
  {
    id: 'priya',
    name: 'Priya Raman',
    role: 'Strength & conditioning lead',
    img: remote('1573496359142-b8d87734a5a2', 400),
    since: '2026',
    bio:
      'A sports scientist first and a lifter second, which is why nobody leaves her floor without a number to beat. ' +
      'She built the club’s return-to-play protocol and still runs every reassessment herself.',
    badges: ['MSc Sport Science', 'UKSCA accredited'],
  },
  {
    id: 'tomas',
    name: 'Tomás Ferrer',
    role: 'Clay-court specialist',
    img: remote('1507003211169-0a1dd7228f2d', 400),
    since: '2026',
    bio:
      'Grew up on the red clay of Córdoba and has never really left it. ' +
      'Sliding, shape and the long rally are his subject, and he will happily spend an hour on footwork alone.',
    badges: ['RPT Level 3', 'Clay-court programme'],
  },
  {
    id: 'mara',
    name: 'Mara Lindqvist',
    role: 'Swim & endurance coach',
    img: remote('1534528741775-53994a69daeb', 400),
    since: '2026',
    bio:
      'Two Nordic open-water titles and a stubborn belief that most swimmers are only one stroke fault away from a new best. ' +
      'She films every lane session and goes through it with you afterwards.',
    badges: ['ASA Level 3', 'Open-water lead'],
  },
  {
    id: 'ade',
    name: 'Ade Obiora',
    role: 'Junior academy director',
    img: remote('1500648767791-00dcc994a43e', 400),
    since: '2026',
    bio:
      'Ran a city-wide schools programme for nine years before taking the academy on. ' +
      'His groups are loud, quick and surprisingly disciplined, which is exactly the point.',
    badges: ['LTA Level 4', 'Safeguarding lead'],
  },
  {
    id: 'helena',
    name: 'Helena Brandt',
    role: 'Recovery & mobility lead',
    img: remote('1494790108377-be9c29b29330', 400),
    since: '2026',
    bio:
      'A physiotherapist who treats recovery as training rather than a reward for it. ' +
      'She owns the contrast suite, the soft-tissue room and the small matter of keeping members on court.',
    badges: ['BSc Physiotherapy', 'Contrast therapy'],
  },
  {
    id: 'rhys',
    name: 'Rhys Calloway',
    role: 'Golf professional',
    img: remote('1504257432389-52343af06ae3', 400),
    since: '2026',
    bio:
      'Eleven seasons teaching off a launch monitor, and he still takes you out on the course to prove the number meant something. ' +
      'Short game is where he does his best work.',
    badges: ['PGA Professional', 'TrackMan certified'],
  },
  {
    id: 'nadia',
    name: 'Nadia Oyelaran',
    role: 'Conditioning & HIIT coach',
    img: remote('1438761681033-6461ffad8d80', 400),
    since: '2026',
    bio:
      'Thirty minutes is plenty, she says, and the heart-rate traces from her classes agree. ' +
      'Former 400m runner, which explains the pacing and the complete lack of sympathy at rep eight.',
    badges: ['NASM CPT', 'Metabolic conditioning'],
  },
]

/** Lookup used by the detail view and the coaches rail. */
export const coachById = (id) => COACHES.find((c) => c.id === id)

/**
 * @typedef {Object} Programme
 * @property {string} slug
 * @property {string} title
 * @property {string} meta      duration or cadence, shown on the card
 * @property {string} tag       badge on the card
 * @property {string} desc      one sentence for the carousel
 * @property {string} img
 * @property {string} discipline  the filter group on the index
 * @property {string} level
 * @property {string} lede      the detail page's standfirst
 * @property {string[]} body    the long read, one string per paragraph
 * @property {{label: string, value: string}[]} facts  the fact strip
 * @property {{n: string, title: string, desc: string}[]} weeks  what a block looks like
 * @property {{title: string, desc: string}[]} cards  information cards
 * @property {string[]} coaches  COACHES ids
 * @property {string} [venue]    a court slug, cross-linked to /courts/:slug
 * @property {number} price      per month, in USD
 */

/** @type {Programme[]} */
export const PROGRAMMES = [
  {
    slug: 'tennis-performance',
    title: 'Tennis Performance',
    meta: '8-week program',
    tag: 'Most popular',
    desc: 'Footwork, serve mechanics and match tactics with a dedicated pro.',
    img: local('baseline.jpg'),
    discipline: 'Racket',
    level: 'Intermediate to advanced',
    price: 220,
    venue: 'centre-court',
    lede:
      'Eight weeks of structured court work for players who already rally well and want the next thing — a serve that holds up under pressure, and a plan for the points they keep losing.',
    body: [
      'The block opens with a filmed baseline session. You hit, we record, and your coach marks the three things worth changing — never more than three, because a player rebuilding five habits at once ends up with none of them.',
      'From there it is two technical sessions and one match-play session a week. The technical work is narrow on purpose: a fortnight on the serve, a fortnight on the backhand wing, a fortnight on transition. Match play is where it gets tested, against someone who will punish the old habit if it comes back.',
      'Week eight repeats the opening session with the same camera in the same corner. Most players are surprised less by the technique than by where they are standing.',
    ],
    facts: [
      { label: 'Commitment', value: '3 sessions a week' },
      { label: 'Group size', value: '1 to 1, or pairs' },
      { label: 'Surface', value: 'Clay and hard court' },
      { label: 'Review', value: 'Filmed, weeks 1 and 8' },
    ],
    weeks: [
      { n: '01', title: 'Assessment', desc: 'Filmed baseline session, movement screen and the three priorities for the block.' },
      { n: '02', title: 'Serve & return', desc: 'Toss, trophy position and the second serve you can actually hit at 4–4.' },
      { n: '03', title: 'Patterns', desc: 'Building the two or three points you want to play, then rehearsing them to boredom.' },
      { n: '04', title: 'Pressure', desc: 'Scored sets from 0–30 down, so the new habit has to survive a losing scoreline.' },
    ],
    cards: [
      { title: 'Video on every session', desc: 'Two fixed cameras on the show courts. Clips land in your account the same evening, cut to the rallies that matter.' },
      { title: 'A hitting partner, not just a feeder', desc: 'Your coach plays the point out. Baskets have their place, but not for four weeks straight.' },
      { title: 'It carries into the ladder', desc: 'Everything here is built to be used in the match-play league, and most members enter one during the block.' },
    ],
    coaches: ['davis', 'tomas'],
  },
  {
    slug: 'strength-conditioning',
    title: 'Strength & Conditioning',
    meta: '12 sessions / month',
    tag: 'Build power',
    desc: 'Progressive lifting and mobility built around your sport.',
    img: local('strength.jpg'),
    discipline: 'Strength',
    level: 'All levels',
    price: 185,
    venue: 'the-pavilion',
    lede:
      'A lifting programme written around the sport you actually play, reassessed every four weeks, and run on a floor where someone is always watching your third rep.',
    body: [
      'Nothing here is generic. A golfer and a doubles player both need rotational power, but they need it at different speeds and from different positions, and the programme is written from that difference rather than from a template.',
      'You start with a movement screen and a set of honest numbers — a trap-bar pull, a jump height, an overhead reach. Those numbers set the loads for the first block and become the thing you argue with four weeks later.',
      'Mobility is not an afterthought tacked onto the end. It is the first fifteen minutes of every session, aimed at the joint your screen said was the problem, and it is the part most members notice first.',
    ],
    facts: [
      { label: 'Commitment', value: '3 sessions a week' },
      { label: 'Group size', value: 'Max 4' },
      { label: 'Reassessed', value: 'Every 4 weeks' },
      { label: 'Platforms', value: '8, never queued' },
    ],
    weeks: [
      { n: '01', title: 'Screen & baseline', desc: 'Movement screen, jump test and the three lifts that set your starting loads.' },
      { n: '02', title: 'Accumulate', desc: 'Volume block. Unglamorous, and the part that makes the rest possible.' },
      { n: '03', title: 'Express', desc: 'Loads drop, speed matters. Medicine ball, trap bar and jumps against a timer.' },
      { n: '04', title: 'Retest', desc: 'The same three lifts and the same jump mat, with the first numbers on the screen beside you.' },
    ],
    cards: [
      { title: 'Eight platforms, no queue', desc: 'The pavilion floor is capped by booking, so a session never becomes forty minutes of waiting for a rack.' },
      { title: 'Written down, every week', desc: 'Your block lives in your account with the loads filled in, so you can train it when your coach is not on the floor.' },
      { title: 'Shared with your other coach', desc: 'If you are also on a court programme, the two coaches write to the same plan rather than competing for your legs.' },
    ],
    coaches: ['priya', 'nadia'],
  },
  {
    slug: 'junior-academy',
    title: 'Junior Academy',
    meta: 'Ages 6–16',
    tag: 'Coached',
    desc: 'Group coaching that grows technique, confidence and fitness.',
    img: local('bluesky.jpg'),
    discipline: 'Racket',
    level: 'Ages 6 to 16',
    price: 140,
    venue: 'the-lawns',
    lede:
      'Four age groups, three afternoons a week, and a coaching team that would rather a child left wanting another twenty minutes than relieved it was over.',
    body: [
      'Groups are set by stage, not by birthday. A nine-year-old who has played for four years trains with the players who can take the same rally, and nobody spends a term being the weakest or the most bored person on court.',
      'The youngest group plays on a smaller court with slower balls, which is not a concession — it is the only way a six-year-old gets to hit a real forehand instead of a lob. They move up when the rally tells us they are ready.',
      'Every term closes with a festival rather than a tournament: everyone plays, everyone is watched by somebody, and the results are noted but not ranked. The ladder is there for the ones who want it.',
    ],
    facts: [
      { label: 'Ages', value: '6 to 16, four groups' },
      { label: 'Ratio', value: '1 coach to 6' },
      { label: 'Terms', value: '3 a year, 10 weeks' },
      { label: 'Rackets', value: 'Loaned, all sizes' },
    ],
    weeks: [
      { n: '01', title: 'Find the group', desc: 'A free taster session, after which we tell you honestly which group fits.' },
      { n: '02', title: 'Technique', desc: 'Grip, contact point and the two shots that carry a junior for years.' },
      { n: '03', title: 'Play', desc: 'Half of every session is points. Children learn tennis by playing tennis.' },
      { n: '04', title: 'Festival', desc: 'End-of-term play day. Families on the terrace, everybody on court.' },
    ],
    cards: [
      { title: 'Kit is loaned, not sold', desc: 'Rackets in every size live in the academy store. Nobody needs to buy equipment to find out whether their child likes the game.' },
      { title: 'Parents watch from the terrace', desc: 'Seated, in the shade, with coffee and a clear view of all four lawns — and out of earshot, which helps everyone.' },
      { title: 'A route into the club', desc: 'Academy families move to a Junior & Family membership at a held rate, and the children keep their coach.' },
    ],
    coaches: ['ade', 'davis'],
  },
  {
    slug: 'golf-improvement',
    title: 'Golf Improvement',
    meta: 'Swing & short game',
    tag: 'On the greens',
    desc: 'Launch-monitor lessons and on-course play with our golf team.',
    img: local('golf.jpg'),
    discipline: 'Golf',
    level: 'Handicap 36 to 6',
    price: 210,
    venue: 'golf-greens',
    lede:
      'Half of this programme happens in the bay with a launch monitor, and half of it happens on the course, because a number that does not survive the fourteenth tee was never worth much.',
    body: [
      'The bay work is where the swing is measured — club path, face angle, strike location, and the gap between what you feel and what the ball does. Most members find the first session uncomfortable and the second one clarifying.',
      'Then you go outside. Your coach walks nine holes with you, says very little, and writes down where the shots actually go. That card is the real curriculum: it usually points at the short game rather than the driver, whatever the bay said.',
      'From there it is one bay session and one on-course session a fortnight, with a gapping day each quarter to re-measure the whole bag.',
    ],
    facts: [
      { label: 'Course', value: 'Par 71, 6,480 yards' },
      { label: 'Monitor', value: 'TrackMan, two bays' },
      { label: 'Format', value: 'Bay + on-course' },
      { label: 'Gapping', value: 'Quarterly, full bag' },
    ],
    weeks: [
      { n: '01', title: 'Measure', desc: 'Full bag on the monitor, plus the numbers nobody enjoys seeing in writing.' },
      { n: '02', title: 'On course', desc: 'Nine holes, coach walking, every shot recorded and nothing coached mid-round.' },
      { n: '03', title: 'Short game', desc: 'Inside a hundred yards, where the strokes are. Usually the longest block.' },
      { n: '04', title: 'Play it back', desc: 'The same nine holes, the same card, and a straight comparison.' },
    ],
    cards: [
      { title: 'Two bays, lit until nine', desc: 'Both covered and both heated, so a winter evening is still a session rather than a cancellation.' },
      { title: 'Clubs checked, not sold', desc: 'Lie angles and shaft gapping are measured on site. We will tell you when a club is wrong and when it is you.' },
      { title: 'Playing partners found for you', desc: 'The golf desk pairs members by handicap for weekend fourballs, which is how most of the golf friendships here started.' },
    ],
    coaches: ['rhys'],
  },
  {
    slug: 'recovery-mobility',
    title: 'Recovery & Mobility',
    meta: 'Spa & physio',
    tag: 'Reset',
    desc: 'Contrast therapy, soft-tissue work and guided mobility flows.',
    img: local('yoga.jpg'),
    discipline: 'Recovery',
    level: 'All levels',
    price: 165,
    venue: 'the-pavilion',
    lede:
      'The programme for people who train enough to need it: contrast bathing, hands-on soft-tissue work and a mobility practice short enough that you will actually keep doing it.',
    body: [
      'It starts with a conversation about load. How many sessions, how hard, how long you have been ignoring the left shoulder. That conversation sets which of the three strands you get most of.',
      'The contrast suite runs hot and cold in a fixed protocol rather than however long you can stand it — three rounds, timed, with the breathing coached for the first fortnight until it is yours.',
      'The mobility flows are twelve minutes. Not forty. Twelve minutes, filmed with you in them, sent to your account, aimed at the two joints your screen flagged. Members who are given twelve minutes do them; members given forty do not.',
    ],
    facts: [
      { label: 'Contrast suite', value: '3 rounds, timed' },
      { label: 'Soft tissue', value: '1 hour, fortnightly' },
      { label: 'Flows', value: '12 minutes, filmed' },
      { label: 'Screen', value: 'Repeated at 6 weeks' },
    ],
    weeks: [
      { n: '01', title: 'Load audit', desc: 'What you are actually doing in a week, and what is accumulating because of it.' },
      { n: '02', title: 'Protocol', desc: 'Contrast bathing learned properly, with the breathing coached rather than guessed.' },
      { n: '03', title: 'Hands on', desc: 'Fortnightly soft-tissue work on whatever the audit and the screen agree about.' },
      { n: '04', title: 'Make it yours', desc: 'Your twelve-minute flow, filmed with you in it, kept in your account.' },
    ],
    cards: [
      { title: 'Booked against your training', desc: 'Recovery slots are offered after your heaviest sessions, not at whatever hour happened to be free.' },
      { title: 'A physiotherapist, on site', desc: 'Helena is here five days a week. A niggle gets looked at this week, not after a six-week referral.' },
      { title: 'Open to every tier', desc: 'The recovery suite is included wherever it is included at all — there is no separate spa membership to buy.' },
    ],
    coaches: ['helena', 'priya'],
  },
  {
    slug: 'cardio-hiit',
    title: 'Cardio & HIIT',
    meta: '30-min express',
    tag: 'High energy',
    desc: 'Short, sharp interval sessions to lift your engine fast.',
    img: local('runners.jpg'),
    discipline: 'Conditioning',
    level: 'All levels',
    price: 120,
    venue: 'the-pavilion',
    lede:
      'Thirty minutes, four times a week, at an intensity that makes the clock the hardest part. Designed for people with a full calendar and no intention of losing their fitness to it.',
    body: [
      'Each class is three blocks with the work and rest fixed in advance, so nobody has to decide how hard to go while out of breath. The decision was made when the session was written.',
      'Intensity is set from your own numbers — a short ramp test in week one gives the coach a pace and a heart rate to hold you to, and both get retested every six weeks.',
      'The format rotates: bike, rower, sled and running track, never the same two days running. That is partly for the joints and mostly so you keep turning up.',
    ],
    facts: [
      { label: 'Length', value: '30 minutes, exactly' },
      { label: 'Cadence', value: 'Up to 4 a week' },
      { label: 'Group size', value: 'Max 10' },
      { label: 'Retest', value: 'Every 6 weeks' },
    ],
    weeks: [
      { n: '01', title: 'Ramp test', desc: 'One uncomfortable eight minutes that sets every pace for the next six weeks.' },
      { n: '02', title: 'Intervals', desc: 'Fixed work and rest, called from the front, no negotiation at rep eight.' },
      { n: '03', title: 'Mixed modal', desc: 'Bike, rower, sled and track, rotated so nothing takes the same beating twice.' },
      { n: '04', title: 'Retest', desc: 'The same eight minutes. The number is almost always better, which is the point.' },
    ],
    cards: [
      { title: 'Six slots a day', desc: 'From 06:15 to 19:45, so the session fits around work rather than replacing an evening.' },
      { title: 'Heart rate on the wall', desc: 'Optional, and anonymised by a number rather than your name. Useful for pacing, not for competing.' },
      { title: 'Pairs well with lifting', desc: 'Most members run this alongside Strength & Conditioning; the two coaches schedule around each other.' },
    ],
    coaches: ['nadia', 'priya'],
  },
  {
    slug: 'match-play-league',
    title: 'Match Play League',
    meta: 'Seasonal ladder',
    tag: 'Compete',
    desc: 'Ranked singles and doubles with weekly fixtures and finals.',
    img: local('fixture.jpg'),
    discipline: 'Racket',
    level: 'Competitive',
    price: 95,
    venue: 'centre-court',
    lede:
      'A proper ladder: one fixture a week, a real scoreline, and a table that moves. Singles and doubles run as separate ladders and you can enter both.',
    body: [
      'You are placed in a division of eight after two seeding matches, and from there it is one fixture a week against someone within reach of you. Fixtures are arranged between the two players, which sounds fragile and in practice works because everyone wants the match.',
      'Divisions promote and relegate two players a season. Nobody stays in the wrong division for long, which is the whole reason the ladder is worth playing rather than just booking courts with friends.',
      'The season closes with finals night on Centre Court under lights, with the terrace open. It is the busiest evening in the club calendar.',
    ],
    facts: [
      { label: 'Season', value: '14 weeks' },
      { label: 'Divisions', value: '8 players each' },
      { label: 'Fixtures', value: '1 a week' },
      { label: 'Finals', value: 'Centre Court, floodlit' },
    ],
    weeks: [
      { n: '01', title: 'Seeding', desc: 'Two matches against players either side of where we think you belong.' },
      { n: '02', title: 'Division play', desc: 'One fixture a week, arranged between you, scores filed the same night.' },
      { n: '03', title: 'Run-in', desc: 'The last four weeks, when the promotion places start to matter and so does the serve.' },
      { n: '04', title: 'Finals night', desc: 'Centre Court under lights, terrace open, the club watching.' },
    ],
    cards: [
      { title: 'Court time is included', desc: 'Your weekly fixture comes with the court. League matches never come out of your own booking allowance.' },
      { title: 'A table that actually updates', desc: 'Results post to your account overnight, and the division table with them. No spreadsheet circulated by email.' },
      { title: 'Coaching between fixtures', desc: 'Players in the ladder get priority on short-notice coaching slots, for the week your backhand deserts you.' },
    ],
    coaches: ['davis', 'tomas'],
  },
  {
    slug: 'endurance-road',
    title: 'Endurance & Road',
    meta: 'Weekend rides',
    tag: 'Go long',
    desc: 'Club rides and indoor threshold work to build a bigger engine.',
    img: local('cycling.jpg'),
    discipline: 'Endurance',
    level: 'Intermediate',
    price: 150,
    venue: 'the-pavilion',
    lede:
      'Two indoor threshold sessions in the week and one long road ride at the weekend — the oldest endurance recipe there is, run properly and with somebody keeping you honest about the easy days.',
    body: [
      'Most riders train too hard on the easy days and not hard enough on the hard ones. The programme fixes that before it does anything else: the weekend ride is deliberately conversational, and the midweek sessions are not.',
      'Indoor work is done on the pavilion’s smart trainers against your own power numbers, set by a twenty-minute test in week one. Sessions are forty to sixty minutes, which is all threshold work ever needs to be.',
      'The weekend ride leaves at seven from the clubhouse in three paced groups, and nobody is dropped — the ride leader for each group is a member who has done it for years and will sit up for you.',
    ],
    facts: [
      { label: 'Indoor', value: '2 sessions a week' },
      { label: 'Road', value: 'Saturdays, 07:00' },
      { label: 'Groups', value: '3, by pace' },
      { label: 'Power test', value: '20 min, every 8 weeks' },
    ],
    weeks: [
      { n: '01', title: 'Power test', desc: 'Twenty minutes, all out, on a trainer that will remember it.' },
      { n: '02', title: 'Threshold', desc: 'Midweek intervals at the numbers that test produced, not at how you feel.' },
      { n: '03', title: 'Long ride', desc: 'Saturday, paced groups, conversational by design and three hours by the end of the block.' },
      { n: '04', title: 'Retest', desc: 'The same twenty minutes, eight weeks later, usually at a noticeably higher number.' },
    ],
    cards: [
      { title: 'Trainers and bikes on site', desc: 'Smart trainers in the pavilion and loan road bikes in three sizes, so travelling members can still ride on Saturday.' },
      { title: 'Nobody gets dropped', desc: 'Three paced groups with a member leading each. The slowest group is the one the club is proudest of.' },
      { title: 'Breakfast afterwards', desc: 'The ride finishes at the clubhouse and the kitchen opens early for it. That is half the reason anyone comes.' },
    ],
    coaches: ['mara', 'nadia'],
  },
  {
    slug: 'swim-aqua',
    title: 'Swim & Aqua',
    meta: 'Lanes & open water',
    tag: 'Low impact',
    desc: 'Stroke technique, threshold sets and easy recovery lengths.',
    img: local('lanes.jpg'),
    discipline: 'Endurance',
    level: 'All levels',
    price: 130,
    venue: 'lakeside-pool',
    lede:
      'Filmed stroke work in a heated twenty-five metre pool, threshold sets for the people who want a time, and quiet recovery lengths for the ones who have just been lifting.',
    body: [
      'Almost every adult swimmer is losing more to one fault than to fitness — a crossing-over catch, a head that lifts, a kick doing nothing but costing oxygen. Week one finds yours on camera, from above and below.',
      'After that it is two coached lane sessions a week. One is technical and slow and occasionally frustrating; the other is a set with a clock, because technique that falls apart at pace has not been learned yet.',
      'Open-water sessions run from June, at a lake twenty minutes away, with safety cover and a coach in the water. They are optional and they are the part members talk about.',
    ],
    facts: [
      { label: 'Pool', value: '25 m, heated, 6 lanes' },
      { label: 'Coached', value: '2 sessions a week' },
      { label: 'Filming', value: 'Above and below water' },
      { label: 'Open water', value: 'June to September' },
    ],
    weeks: [
      { n: '01', title: 'Film the stroke', desc: 'Two cameras, both angles, and the one fault that is costing you the most.' },
      { n: '02', title: 'Drills', desc: 'Slow, repetitive and the only thing that ever changes a catch.' },
      { n: '03', title: 'Against the clock', desc: 'Threshold sets on a send-off, where the new stroke has to hold up tired.' },
      { n: '04', title: 'Open water', desc: 'From June: sighting, pack swimming and the first cold morning of the year.' },
    ],
    cards: [
      { title: 'Lanes are capped', desc: 'Three swimmers to a lane during coached sessions, so a set is a set rather than an obstacle course.' },
      { title: 'Recovery swims count', desc: 'Easy lengths after a heavy lifting block are written into your plan, not treated as a day off.' },
      { title: 'Open water with cover', desc: 'Safety boat, tow floats and a coach in the water. Members who were nervous in June are racing by August.' },
    ],
    coaches: ['mara', 'helena'],
  },
]

/** Lookup for /programmes/:slug. */
export const programmeBySlug = (slug) => PROGRAMMES.find((p) => p.slug === slug)

/** The filter groups on the index, derived so a new programme appears on its own. */
export const DISCIPLINES = [...new Set(PROGRAMMES.map((p) => p.discipline))]

/* The carousel on the homepage wants the short fields plus a destination.
   Derived here so src/data/training.js no longer keeps a parallel list that
   could drift out of step with the pages these cards now open. */
export const PLANS = PROGRAMMES.map((p) => ({
  title: p.title,
  meta: p.meta,
  tag: p.tag,
  desc: p.desc,
  img: p.img,
  href: paths.programme(p.slug),
}))
