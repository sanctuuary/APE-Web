/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Rule } from 'antd/lib/form';

/**
 * The rules for this site's passwords
 */
const passwordRules: Rule[] = [
  {
    required: true,
    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$#%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,}$/,
    min: 8,
    max: 128,
    message: 'Enter a valid password',
  },
];

export default passwordRules;
