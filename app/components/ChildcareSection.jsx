import React from 'react';
import { Field, FieldArray } from 'redux-form';
import moment from 'moment';

const validateChildFunctions = {};
const validateChild = (minAge, maxAge) => {
    // memoization to avoid the update freakout
    const s = `${minAge}-${maxAge}`;
    if (!validateChildFunctions[s]) {
        validateChildFunctions[s] = (value) => {
            const { age, name, days } = value || {};
            const errors = [];

            if (!name) {
                errors.push('Please enter the child\'s name.');
            }

            if (age === undefined || isNaN(age)) {
                errors.push('Please enter the child\'s age.');
            } else if (age < minAge) {
                errors.push(`The child must be at least ${minAge} years old to attend.`);
            } else if (age > maxAge) {
                errors.push(`The child must be ${maxAge} years old or younger to attend.`);
            }

            if (days && !days.filter(day => day.filter(slot => slot).length != 0).length) {
                errors.push('Please select at least one timeslot for your child to attend.');
            }

            return errors.join(' ');
        };
    }
    return validateChildFunctions[s];
}

const renderChild = ({ id, input, label, type, dates, daysByDate, slots, onRemove, meta: { touched, error } }) => {
    const { name, onChange, onBlur, onFocus } = input;
    const value = input.value || {};

    if (!value.days) {
        value.days = dates.map(date => slots.map(v => false))
    }

    const update = (updater) => ({ target: { type, checked, value: newValue } }) =>
        onChange(
            updater(
                type == 'checkbox' ? checked : newValue,
                value));

    const canShowError = (touched || (value.name !== undefined && value.age !== undefined));

    return <div className="child-container">
        <div className="child">
            <div className={"form-group child-name required " + (canShowError && error && "error ")}>
                <label htmlFor={`${id}-name`}>Child Name</label>
                <input type="text"
                    value={value.name || ''}
                    onChange={update((v, s) => ({ ...s, name: v }))}
                    onFocus={onFocus}
                    id={`${id}-name`} />
            </div>
            <div className={"form-group child-age required " + (canShowError && error && "error ")}>
                <label htmlFor={`${id}-age`}>Age</label>
                <input type="text"
                    value={value.age || ''}
                    onChange={update((v, s) => ({ ...s, age: parseInt(v) }))}
                    onFocus={onFocus}
                    id={`${id}-age`} />
            </div>
            <div className={"form-group child-slots required " + (canShowError && error && "error ")}>
                <label>
                    {dates.map((date, d_ix) => <span key={d_ix} className="child-day">{moment(date).format('ddd')}</span>)}
                </label>
                <div className="child-slots-container">
                    {slots.map((slot, s_ix) => <div key={s_ix}>
                        <div className="child-slot">{slot}</div>
                        {dates.map((date, d_ix) => {
                            const myvalue = value.days[d_ix][s_ix];
                            return <div className="child-day" key={d_ix}>
                                {daysByDate[date].indexOf(slot) != -1
                                    ? <input type="checkbox"
                                        onChange={update((v, { days, ...s }) => {
                                            const newDays = [...days];
                                            const theDay = newDays[d_ix] = [...newDays[d_ix]];
                                            theDay[s_ix] = v;
                                            return ({ ...s, days: newDays });
                                        })}
                                        onFocus={onFocus}
                                        checked={myvalue} />
                                    : undefined}
                            </div>;
                        })}
                    </div>)}
                </div>
            </div>
            <div className="form-group child-controls">
                <a href="javascript:void(0)" onClick={onRemove}>🗑️&nbsp;Remove</a>
            </div>
        </div>
        <div className="error">{canShowError && error}</div>
    </div>
};

const renderChildren = ({ fields, meta: { error, submitFailed }, minAge, maxAge, dates, daysByDate, slots }) => {
    if (fields.length == 0) {
        fields.push({});
    }

    return <div className="children-list">
        {fields.map((member, index) =>
            <Field component={renderChild}
                key={index}
                id={`child-${index}`}
                name={member}
                onRemove={() => fields.remove(index)}
                validate={validateChild(minAge, maxAge)}
                dates={dates} daysByDate={daysByDate}
                slots={slots} />)}
        <div>
            <a href="javascript:void(0)" onClick={() => fields.push({})}>➕add another child</a>
        </div>
    </div>;
}

export const ChildcareSection = ({ dates, daysByDate, minAge, maxAge, ...props }) => <div>
    <p>
        The Childrens' programme is available to children from ages <strong>{minAge}</strong> to <strong>{maxAge}</strong> The Childrens' programme is available at these times:
    </p>
    <table className="childcare-table" cellPadding="0" cellSpacing="0">
        <thead>
            <tr>
                <th>Date</th>
                <th>Times</th>
            </tr>
        </thead>
        <tbody>
            {dates.map(date => <tr key={date}>
                <td>{moment(date).format('ddd, DD MMM')}</td>
                <td>{daysByDate[date].join(', ')}</td>
            </tr>)}
        </tbody>
    </table>
    <p>
        Please enter the information for each of your children, indicating
        the timeslots where he or she will attend the children's programme.
    </p>
    <FieldArray name="children"
        component={renderChildren}
        dates={dates}
        daysByDate={daysByDate}
        minAge={minAge}
        maxAge={maxAge}
        {...props} />
</div>