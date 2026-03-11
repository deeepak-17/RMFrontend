/**
 * vaCommands.ts — Voice Command Detection for ResQMeals
 * Handles navigation and action commands across all pages and roles.
 * Commands are detected BEFORE KB Q&A lookup.
 */

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
export type UserRole = 'ngo' | 'donor' | 'volunteer' | 'admin';

export interface NavCommand {
  patterns: string[];
  route: (role: UserRole) => string | null;
  description: string;
}

export interface ActionCommand {
  patterns: string[];
  key: string;
  roles?: UserRole[];
  description: string;
}

// ─────────────────────────────────────────────
//  NAVIGATION COMMANDS
//  route() returns null if the command doesn't apply to the current role
// ─────────────────────────────────────────────
export const NAV_COMMANDS: NavCommand[] = [
  {
    patterns: ['dashboard','home','go home','go to dashboard','main page','back to home','back to dashboard',
      'डैशबोर्ड','होम','मुख्य पृष्ठ','டாஷ்போர்டு','முகப்பு',
    ],
    route: (role) => `/${role}/dashboard`,
    description: 'Go to your dashboard',
  },
  {
    patterns: ['add donation','donate food','donate','new donation','create donation','add food','post donation',
      'दान जोड़ें','खाना दान करें','दान करें','நன்கொடை சேர்க்க','உணவு தர',
    ],
    route: (role) => role === 'donor' ? '/donor/add' : null,
    description: 'Add a new food donation',
  },
  {
    patterns: ['available donations','find food','find donations','available food','claim food','nearby donations',
      'food available','show donations','view donations','browse donations',
      'उपलब्ध दान','खाना खोजें','கிடைக்கும் நன்கொடைகள்','உணவு தேட',
    ],
    route: (role) => role === 'ngo' ? '/ngo/available' : null,
    description: 'Browse available donations',
  },
  {
    patterns: ['donation history','my history','past donations','history','past collections',
      'my donations','donation records','previous donations','old donations',
      'दान इतिहास','इतिहास','नन்கொடை வரலாறு','வரலாறு',
    ],
    route: (role) => {
      if (role === 'ngo') return '/ngo/history';
      if (role === 'donor') return '/donor/history';
      return null;
    },
    description: 'View your donation history',
  },
  {
    patterns: ['my tasks','tasks','pickup tasks','view tasks','deliveries','pickups','assignments',
      'show tasks','task list','pending tasks','active tasks',
      'मेरे कार्य','कार्य','என் பணிகள்','பணிகள்',
    ],
    route: (role) => role === 'volunteer' ? '/volunteer/tasks' : null,
    description: 'View your pickup tasks',
  },
  {
    patterns: ['volunteer dashboard','volunteer home','my dashboard',
      'स्वयंसेवक डैशबोर्ड','தன்னார்வலர் டாஷ்போர்டு',
    ],
    route: (role) => role === 'volunteer' ? '/volunteer/dashboard' : null,
    description: 'Go to volunteer dashboard',
  },
];

// ─────────────────────────────────────────────
//  ACTION COMMANDS (dispatched as custom events)
//  Pages listen for window event 'va-action' with detail.key
// ─────────────────────────────────────────────
export const ACTION_COMMANDS: ActionCommand[] = [
  {
    patterns: ['submit','save','done','confirm','post','post donation','submit donation','save donation',
      'जमा करें','सहेजें','சமர்ப்பி','சேமி',
    ],
    key: 'submit-form',
    roles: ['donor'],
    description: 'Submit the current form',
  },
  {
    patterns: ['get my location','use my location','detect location','current location','auto location',
      'मेरी लोकेशन','लोकेशन लो','என் இடம்','இடத்தை கண்டறி',
    ],
    key: 'get-location',
    roles: ['donor'],
    description: 'Auto-fill current GPS location',
  },
  {
    patterns: ['cancel','go back','discard','forget it','never mind','reset form',
      'रद्द करें','वापस जाएं','ரத்து செய்','திரும்பு',
    ],
    key: 'go-back',
    description: 'Cancel and go back',
  },
  {
    patterns: ['claim','claim this','claim donation','accept donation','take donation',
      'दावा करें','क्लेम करें','கோரு','கிளைம்',
    ],
    key: 'claim-first',
    roles: ['ngo'],
    description: 'Claim the top available donation',
  },
  {
    patterns: ['accept task','start task','take task','confirm pickup','start pickup',
      'कार्य स्वीकार करें','काम लो','பணி ஏற்க','பிக்கப் தொடங்கு',
    ],
    key: 'accept-task',
    roles: ['volunteer'],
    description: 'Accept the pending task',
  },
  {
    patterns: ['complete task','mark done','task done','delivery done','delivered','completed',
      'कार्य पूरा','डिलीवरी हो गई','பணி முடிந்தது','வழங்கப்பட்டது',
    ],
    key: 'complete-task',
    roles: ['volunteer'],
    description: 'Mark current task as completed',
  },
  {
    patterns: ['veg','vegetarian','set veg','veg food',
      'शाकाहारी','வெஜ்',
    ],
    key: 'set-veg',
    roles: ['donor'],
    description: 'Set food type to vegetarian',
  },
  {
    patterns: ['non veg','non-veg','nonveg','meat','chicken','fish',
      'मांसाहारी','நான் வெஜ்',
    ],
    key: 'set-nonveg',
    roles: ['donor'],
    description: 'Set food type to non-vegetarian',
  },
  {
    patterns: ['vegan','plant based','plant-based',
      'வீகன்','शाकाहारी वीगन',
    ],
    key: 'set-vegan',
    roles: ['donor'],
    description: 'Set food type to vegan',
  },
  // ── Global logout ─────────────────────────────────
  {
    patterns: [
      'logout','log out','sign out','exit','bye','goodbye',
      'लॉगआउट','साइन आउट','बाहर जाएं',
      'வெளியேறு','லாக் அவுட்',
      'لاگ آوٹ','سائن آوٹ',
    ],
    key: 'logout',
    description: 'Log out of the application',
  },
  // ── Donor History page actions ─────────────────────
  {
    patterns: [
      'track','track donation','track my donation','track status',
      'show journey','donation journey','where is my donation','track latest',
    ],
    key: 'track-latest',
    roles: ['donor'],
    description: 'Track the latest donation status',
  },
  {
    patterns: [
      'delete donation','remove donation','delete latest','delete my donation',
      'cancel donation','remove latest','delete first',
    ],
    key: 'delete-latest',
    roles: ['donor'],
    description: 'Delete the most recent available donation',
  },
  {
    patterns: [
      'edit donation','edit latest','modify donation','update donation',
      'edit my donation','change donation','edit first',
    ],
    key: 'edit-latest',
    roles: ['donor'],
    description: 'Edit the most recent available donation',
  },
  {
    patterns: [
      'show available','filter available','available donations','filter by available',
    ],
    key: 'filter-available',
    roles: ['donor'],
    description: 'Filter donations by available status',
  },
  {
    patterns: [
      'show reserved','filter reserved','reserved donations','filter by reserved',
    ],
    key: 'filter-reserved',
    roles: ['donor'],
    description: 'Filter donations by reserved status',
  },
  {
    patterns: [
      'show collected','filter collected','collected donations','filter by collected',
    ],
    key: 'filter-collected',
    roles: ['donor'],
    description: 'Filter donations by collected status',
  },
  {
    patterns: [
      'show all','all donations','filter all','show everything','reset filter',
    ],
    key: 'filter-all',
    roles: ['donor'],
    description: 'Show all donations',
  },
  {
    patterns: [
      'refresh','reload','update list','fetch donations','refresh list',
    ],
    key: 'refresh-list',
    description: 'Refresh the donations list',
  },
  // ── NGO Available page actions ─────────────────────────────
  {
    patterns: ['show map','open map','map view','switch to map','view on map','navigate to map'],
    key: 'show-map',
    roles: ['ngo'],
    description: 'Switch to map view',
  },
  {
    patterns: ['show list','list view','switch to list','show list view','close map'],
    key: 'show-list',
    roles: ['ngo'],
    description: 'Switch to list view',
  },
  {
    patterns: ['impact report','show impact','impact summary','view impact','open impact'],
    key: 'impact-report',
    roles: ['ngo'],
    description: 'Navigate to or show impact section',
  },
  // ── NGO History page actions ──────────────────────────────
  {
    patterns: ['total collections','how many collections','collection count','total collected'],
    key: 'ngo-total',
    roles: ['ngo'],
    description: 'Announce total collections stat',
  },
  {
    patterns: ['people fed','how many fed','meals served','meals delivered'],
    key: 'ngo-people-fed',
    roles: ['ngo'],
    description: 'Announce people fed stat',
  },
  {
    patterns: ['pending pickups','pending','how many pending','pending collections'],
    key: 'ngo-pending',
    roles: ['ngo'],
    description: 'Announce pending pickups stat',
  },
  {
    patterns: ['show all collections','all collections','ngo filter all','reset collections'],
    key: 'ngo-filter-all',
    roles: ['ngo'],
    description: 'Show all NGO collections',
  },
  {
    patterns: ['show collected','filter collected','collected items','show only collected'],
    key: 'ngo-filter-collected',
    roles: ['ngo'],
    description: 'Filter NGO history to collected',
  },
  {
    patterns: ['show reserved','filter reserved','reserved items','show only reserved'],
    key: 'ngo-filter-reserved',
    roles: ['ngo'],
    description: 'Filter NGO history to reserved',
  },
  {
    patterns: ['track','track donation','track food','track item','track status','show journey','chain of custody'],
    key: 'track-latest',
    roles: ['ngo'],
    description: 'Track latest/named donation journey',
  },
  // ── Volunteer Tasks page actions ──────────────────────────
  {
    patterns: ['decline task','reject task','refuse task','decline','reject','skip task'],
    key: 'decline-task',
    roles: ['volunteer'],
    description: 'Decline the first assigned task',
  },
  {
    patterns: ['mark picked','picked up','mark as picked','food picked','i picked it up'],
    key: 'mark-picked',
    roles: ['volunteer'],
    description: 'Mark task as picked up',
  },
  {
    patterns: ['mark delivered','delivered','mark as delivered','food delivered','i delivered it'],
    key: 'mark-delivered',
    roles: ['volunteer'],
    description: 'Mark task as delivered',
  },
  {
    patterns: ['active tasks','show active','in progress tasks','ongoing tasks','current tasks'],
    key: 'filter-active',
    roles: ['volunteer'],
    description: 'Show only active/accepted tasks',
  },
  {
    patterns: ['completed tasks','show completed','done tasks','finished tasks','delivered tasks'],
    key: 'filter-completed',
    roles: ['volunteer'],
    description: 'Show only completed tasks',
  },
];

// ─────────────────────────────────────────────
//  DETECTION FUNCTIONS
// ─────────────────────────────────────────────

/** Score a pattern against the query using word overlap */
function scorePattern(query: string, patterns: string[]): number {
  const q = query.toLowerCase();
  let best = 0;
  for (const p of patterns) {
    const pl = p.toLowerCase();
    if (q.includes(pl)) {
      best = Math.max(best, pl.split(/\s+/).length * 5);
    } else {
      const words = pl.split(/\s+/);
      let hits = 0;
      for (const w of words) {
        if (w.length > 1 && q.includes(w)) hits++;
      }
      best = Math.max(best, hits);
    }
  }
  return best;
}

/** Returns the target route if query matches a navigation command */
export function detectNavigation(query: string, role: UserRole): string | null {
  let best: { score: number; route: string | null } = { score: 0, route: null };
  for (const cmd of NAV_COMMANDS) {
    const score = scorePattern(query, cmd.patterns);
    if (score > best.score) {
      best = { score, route: cmd.route(role) };
    }
  }
  return best.score >= 3 && best.route ? best.route : null;
}

/** Returns the action key if query matches an action command */
export function detectAction(query: string, role: UserRole): string | null {
  let best: { score: number; key: string } = { score: 0, key: '' };
  for (const cmd of ACTION_COMMANDS) {
    if (cmd.roles && !cmd.roles.includes(role)) continue;
    const score = scorePattern(query, cmd.patterns);
    if (score > best.score) {
      best = { score, key: cmd.key };
    }
  }
  return best.score >= 3 ? best.key : null;
}

/** Dispatch a voice action event that any page can listen for */
export function dispatchVoiceAction(key: string) {
  window.dispatchEvent(new CustomEvent('va-action', { detail: { key } }));
}

// ─────────────────────────────────────────────
//  FIELD FILL — parse "field is value" patterns
// ─────────────────────────────────────────────
export interface FieldFill {
  field: string;
  value: string;
}

function extractAfterKeyword(q: string, keywords: string[]): string | null {
  // Tries: "[keyword] is [value]", "[keyword] [value]", "[keyword]: [value]"
  for (const kw of keywords) {
    const re = new RegExp(
      `(?:${kw})\\s*(?:is|to|as|:)?\\s+(.{2,})`, 'i'
    );
    const m = q.match(re);
    if (m) return m[1].trim().replace(/[.!?]+$/, '');
  }
  return null;
}

export function detectFieldFill(query: string): FieldFill | null {
  const q = query.toLowerCase();

  // ── Food title / name ─────────────────────────────────────
  const title = extractAfterKeyword(q, [
    'food name', 'food description', 'title', 'dish name', 'item name',
    'food is', 'dish is', 'item is', 'name the food', 'describe the food',
  ]);
  if (title) return { field: 'title', value: title };

  // ── Quantity ──────────────────────────────────────────────
  const qtyMatch = q.match(
    /(?:quantity|amount|count|number of|how many)\s+(?:is\s+)?(\d+(?:\.\d+)?)\s*(plates?|kg|kilograms?|servings?|portions?)?/i
  ) || q.match(/(\d+)\s+(plates?|kg|kilograms?|servings?|portions?)/i);
  if (qtyMatch) {
    const num = qtyMatch[1];
    const unitRaw = (qtyMatch[2] || '').toLowerCase();
    const unit = unitRaw.startsWith('kg') || unitRaw.startsWith('kilo')
      ? 'kg'
      : unitRaw.startsWith('serv') || unitRaw.startsWith('port')
      ? 'servings'
      : unitRaw.startsWith('plate')
      ? 'plates'
      : null;
    // Dispatch unit separately if detected
    if (unit) {
      setTimeout(() =>
        window.dispatchEvent(new CustomEvent('va-action', { detail: { key: 'fill-field', field: 'unit', value: unit } })),
        50
      );
    }
    return { field: 'quantity', value: num };
  }

  // ── Unit only ─────────────────────────────────────────────
  const unitMatch = q.match(/(?:unit|in|measure(?:ment)?)\s+(?:is\s+)?(plates?|kg|kilograms?|servings?|portions?)/i);
  if (unitMatch) {
    const u = unitMatch[1].toLowerCase();
    const mapped = u.startsWith('kg') || u.startsWith('kilo') ? 'kg'
      : u.startsWith('serv') || u.startsWith('port') ? 'servings' : 'plates';
    return { field: 'unit', value: mapped };
  }

  // ── Address / Pickup location ─────────────────────────────
  const addr = extractAfterKeyword(q, [
    'address', 'pickup address', 'location', 'pickup location',
    'pickup from', 'collected from', 'from location',
  ]);
  if (addr) return { field: 'address', value: addr };

  // ── Prepared time ─────────────────────────────────────────
  // Simple: extract time, build a datetime-local string (today's date + that time)
  const timeMatch = q.match(
    /(?:prepared at|prepared time|cooked at|made at|time is|food made at)\s+(.{2,})/i
  );
  if (timeMatch) {
    // Build ISO-ish string: today @ given time
    const timeStr = timeMatch[1].trim();
    const d = new Date();
    const parsed = new Date(`${d.toDateString()} ${timeStr}`);
    if (!isNaN(parsed.getTime())) {
      // datetime-local input format: YYYY-MM-DDTHH:mm
      const iso = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      return { field: 'preparedAt', value: iso };
    }
  }

  // ── Food type ─────────────────────────────────────────────
  if (/\bvegan\b/.test(q)) return { field: 'foodType', value: 'vegan' };
  if (/\bnon.?veg/.test(q) || /\bmeat\b/.test(q) || /\bchicken\b/.test(q) || /\bfish\b/.test(q))
    return { field: 'foodType', value: 'non-veg' };
  if (/\bveg(?:etarian)?\b/.test(q) && !/\bnon\b/.test(q))
    return { field: 'foodType', value: 'veg' };

  return null;
}

/** Dispatch a fill-field voice action */
export function dispatchFieldFill(fill: FieldFill) {
  window.dispatchEvent(new CustomEvent('va-action', {
    detail: { key: 'fill-field', field: fill.field, value: fill.value },
  }));
}

