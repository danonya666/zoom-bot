const options = {
  timestamps: true,
  toObject: {
    getters: true,
    virtuals: true
  },
};
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
let  BatchSchema = new Schema({
  class: { type: String },
  zoomLink: { type: String },
  status: { type: String, enum: ['completed', 'active', 'waiting'], default: 'waiting' },
  users: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nickname: {type: String },
    joinDate: {type: Date },
    isActive: {type: Boolean, default: true },
    kickedAfterRound: Number,
    gender: {type: String, required: false, $enum: ['male', 'female', 'prefer not to say']}
  }],
  roundSurvey: [{type: String }],
  rounds: [{
    startTime: Date,
    endTime: Date,
    status: { type: String, enum: ['completed', 'active', 'presurvey', 'midsurvey', 'prepresurvey', 'postsurvey'], default: 'presurvey' },
    teams: [{
      users: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        nickname: {type: String },
      }],
      chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    }],
    number: Number,
    score: {type: Number, default: 0},
  }],
  templateName: {type: String },
  preChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
  currentRound: {type: Number , default: 0},
  startTime: Date,
  teamSize: {type: Number },
  roundMinutes: {type: Number },
  surveyMinutes: {type: Number },
  expRounds: [],
  numRounds: {type: Number },
  dynamicTeamRounds: [],
  tasks: [{
    hasPreSurvey: {type: Boolean , default: false},
    hasMidSurvey: {type: Boolean , default: false},
    preSurvey: [{
      question: {type: String },
      type: {type: String },
      options: [{option: {type: String }}],
      selectOptions: [{value: {type: String }, label: {type: String }}],
      randomOrder: {type: Boolean, default: false},
      to: {type: Number},
      from: {type: Number},
    }],
    message: {type: String },
    steps: [{
      time: {type: Number },
      message: {type: String }
    }],
    survey: [{
      question: {type: String },
      type: {type: String },
      options: [{option: {type: String }}],
      selectOptions: [{value: {type: String }, label: {type: String }}],
      randomOrder: {type: Boolean, default: false},
      to: {type: Number},
      from: {type: Number},
    }],
    pinnedContent: [{
      text: {type: String },
      link: {type: String},
    }],
    readingPeriods: [{
      time: {type: Number },
      message: {type: String },
    }],
    selectiveMasking: {type: Boolean, default: false},
    polls: [{
      text: {type: String},
      type: {type: String, $enum: ['foreperson', 'casual'] },
      // options: [{option: {type: String,}}],
      // selectOptions: [{value: {type: String}, label: {type: String,}}],
      questions: [{text:{type: String}, type: {type: String, enum: ['primary', 'text', 'single', 'checkbox']}, options:[{option: {type: String}}],
        selectOptions: [{value: {type: String}, label: {type: String,}}]}],
      threshold: {type: Number, required: false},
      step: {type: Number }, // nubmer of step on which the poll appears
    }],
  }],
  midQuestions: [String],
  HITId: {type: String, },
  HITTitle: String,
  maskType: {type: String , $enum: ['masked', 'unmasked']},
  note: {type: String, },
  roundGen: [{teams: [{users: [Number]}]}],
  withAvatar: {type: Boolean, default: false },
  withRoster: {type: Boolean, default: false },
  withAutoStop: {type: Boolean, default: true },
  rememberTeamOrder: {type: Boolean, default: false },
  teamFormat: {type: String },
  bestRoundFunction: {type: String, $enum: ['highest', 'lowest', 'average', 'random', 'do not reconvene']}, // do not reconvene anything
  randomizeExpRound: {type: Boolean, default: false},
  worstRounds: [], // [worst round, reconvening of worst round]; (Math.max.apply(null, worstRounds) === number of reconvening round) MUST BE TRUE
  reconveneWorstRound: {type: Boolean, default: false}, // this field doesn't matter if bestRoundFunction === 'do not reconvene'
  hasPostSurvey: {type: Boolean, default: false},
  hasPreSurvey: {type: Boolean, default: false},
  postSurvey: [{
    question: {type: String },
    type: {type: String },
    options: [{option: {type: String }}],
    selectOptions: [{value: {type: String }, label: {type: String }}],
    randomOrder: {type: Boolean, default: false},
    to: {type: Number},
    from: {type: Number},
  }],
  preSurvey: [{
    question: {type: String },
    type: {type: String },
    options: [{option: {type: String }}],
    selectOptions: [{value: {type: String }, label: {type: String }}],
    randomOrder: {type: Boolean, default: false},
    to: {type: Number},
    from: {type: Number},
  }],
  unmaskedPairs: {
    likes: [[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}, {type: mongoose.Schema.Types.ObjectId, ref: 'User'}]],
    dislikes: [[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}, {type: mongoose.Schema.Types.ObjectId, ref: 'User'}]]
  },
  activePoll: { type: Number, required: false },
  dynamicTeamSize: { type: Boolean  },
  roundPairs: [{pair: [{roundNumber: {type: Number}, versionNumber: {type: Number}}, {roundNumber: {type: Number}, versionNumber: {type: Number}}], caseNumber: { type: Number } }],
  cases: [{
    versions: [{
      parts: [{
        text: { type: String  },
        time: { type: Number  },
      }]
    }]
  }],
}, options);
export const Batch = mongoose.model('Batch', BatchSchema);