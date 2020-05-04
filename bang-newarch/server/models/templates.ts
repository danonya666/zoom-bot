const options = {
  timestamps: true,
  toObject: {
    getters: true,
    virtuals: true
  },
};
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
let  TemplateSchema = new Schema({
  name: {type: String, required: false},
  teamSize: {type: Number, required: false},
  roundMinutes: {type: Number, required: false},
  surveyMinutes: {type: Number, required: false},
  numRounds: {type: Number, required: false},
  HITTitle: String,
  numExpRounds: {type: Number, required: false},
  tasks: [{
    hasPreSurvey: {type: Boolean, required: false, default: false},
    hasMidSurvey: {type: Boolean, required: false, default: false},
    hasPinnedContent: {type: Boolean, required: false, default: false},
    preSurvey: [{
      question: {type: String, required: false},
      type: {type: String, required: false},
      options: [{option: {type: String, required: false}}],
      selectOptions: [{value: {type: String, required: false}, label: {type: String, required: false}}],
      randomOrder: {type: Boolean, default: false},
      to: {type: Number},
      from: {type: Number},
    }],
    message: {type: String, required: false},
    steps: [{
      time: {type: Number, required: false},
      message: {type: String, required: false}
    }],
    survey: [{
      question: {type: String, required: false},
      type: {type: String, required: false},
      options: [{option: {type: String, required: false}}],
      selectOptions: [{value: {type: String, required: false}, label: {type: String, required: false}}],
      randomOrder: {type: Boolean, default: false},
      to: {type: Number},
      from: {type: Number},
    }],
    pinnedContent: [{
      text: {type: String, required: false},
      link: {type: String},
    }],
    readingPeriods: [{
      time: {type: Number, required: false},
      message: {type: String, required: false},
    }],
    selectiveMasking: {type: Boolean, default: false},
    polls: [{
      text: {type: String},
      type: {type: String, $enum: ['foreperson', 'casual']},
      // options: [{option: {type: String,}}],
      // selectOptions: [{value: {type: String}, label: {type: String,}}],
      questions: [{text:{type: String}, type: {type: String, enum: ['primary', 'text', 'single', 'checkbox']}, options:[{option: {type: String}}],
        selectOptions: [{value: {type: String}, label: {type: String,}}]}],
      threshold: {type: Number, required: false},
      step: { type: Number, required: false },
    }],
  }],
  teamFormat: {type: String, required: false},
  hasPostSurvey: {type: Boolean, required: false, default: false},
  hasPreSurvey: {type: Boolean, required: false, default: false},
  postSurvey: [{
    question: {type: String, required: false},
    type: {type: String, required: false},
    options: [{option: {type: String, required: false}}],
    selectOptions: [{value: {type: String, required: false}, label: {type: String, required: true}}],
    randomOrder: {type: Boolean, default: false},
    to: {type: Number},
    from: {type: Number},
  }],
  preSurvey: [{
    question: {type: String, required: false},
    type: {type: String, required: false},
    options: [{option: {type: String, required: false}}],
    selectOptions: [{value: {type: String, required: false}, label: {type: String, required: false}}],
    randomOrder: {type: Boolean, default: false},
    to: {type: Number},
    from: {type: Number},
  }],
  cases: [{
    name: { type: String, required: true },
    lastName: { type: String, required: true },
  }],
}, options);
export const Template = mongoose.model('Template', TemplateSchema);
