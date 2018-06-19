import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import _ from 'lodash';
import moment from 'moment';

const required = value =>
    value && /[a-zA-Z]{2,}/.test(value)
        ? undefined
        : 'Required';
const email = value =>
    value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? undefined
        : 'Please enter a valid email address';
const telephone = value =>
    value && /^\+(?:[- ()\[\]]*[0-9]){11,15}$|^(?:[- ()\[\]]*[0-9]){10}$/i.test(value)
        ? undefined
        : 'Please enter a valid telephone number'

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


const renderField = ({ id, input, label, type, required, meta: { touched, error, warning } }) =>
    <div className={"form-group " + (required && "required ") + (touched && error && "error ")}>
        <label htmlFor={id}>{label}</label>
        <input {...input} id={id} type={type} />
        <div className="error">
            {touched && error}
        </div>
    </div>;

const renderCheckbox = ({ id, input, label, type }) =>
    <div>
        <input type={type}
            className="css-checkbox"
            id={id}
            {...input} />
        <label className="css-label" htmlFor={id}>{label}</label>
    </div>;

const renderChild = ({ id, input, label, type, dates, daysByDate, slots, onRemove, meta: { touched, error } }) => {
    const { name, onChange, onBlur, onFocus } = input;
    const value = input.value || {};

    console.log(onBlur.toString());
    if (!value.days) {
        value.days = dates.map(date => slots.map(v => false))
    }

    const update = (updater) => ({ target: { type, checked, value: newValue } }) =>
        onChange(
            updater(
                type == 'checkbox' ? checked : newValue,
                value));

    return <div className="child-container">
        <div className="child">
            <div className="form-group child-name">
                <label htmlFor={`${id}-name`}>Child Name</label>
                <input type="text"
                    value={value.name || ''}
                    onChange={update((v, s) => ({ ...s, name: v }))}
                    onFocus={onFocus}
                    id={`${id}-name`} />
            </div>
            <div className="form-group child-age">
                <label htmlFor={`${id}-age`}>Age</label>
                <input type="text"
                    value={value.age || ''}
                    onChange={update((v, s) => ({ ...s, age: parseInt(v) }))}
                    onFocus={onFocus}
                    id={`${id}-age`} />
            </div>
            <div className="form-group child-slots">
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
        <div className="error">{(value.name !== undefined && value.age !== undefined) && error}</div>
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

const ChildcareSection = ({ dates, daysByDate, minAge, maxAge, ...props }) => <div>
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

let PersonalDetails = ({ needsChildcare, fillingForm: { childcare } }) => {
    const hasChildcare = childcare && childcare.days && !!childcare.days.length;
    const childcareTitle = childcare && childcare.title;
    const childcareSubtitle = childcare && childcare.subtitle;
    const minAge = childcare && childcare.minAge;
    const maxAge = childcare && childcare.maxAge;

    const days = childcare.days || [];
    const slots = _(days)
        .flatMap(day => day.slots)
        .uniq()
        .orderBy(x => x)
        .value();
    const dates = days.map(({ date }) => date);
    const dateDays = days.map(({ date }) => moment(date).format('ddd'));
    const daysByDate = {};
    days.forEach(day => daysByDate[day.date] = day.slots);

    return <div>
        <h2>Personal Information</h2>
        <p>Please the personal information for the registrant.</p>

        <Field component={renderField} label="Title" type="text" id="title" required autoComplete="honorific-prefix" validate={required} name="title" />
        <Field component={renderField} label="First Name" type="text" id="firstname" required autoComplete="given-name" validate={required} name="firstname" />
        <Field component={renderField} label="Surname" type="text" id="lastname" required autoComplete="family-name" validate={required} name="lastname" />
        <Field component={renderField} label="Contact Number" type="text" id="contactNumber" required autoComplete="tel" validate={telephone} name="contactNumber" />
        <Field component={renderField} label="Email" type="email" id="email" required autoComplete="email" validate={email} name="email" />
        <Field component={renderField} label="Which country are you from?" type="text" id="country" required autoComplete="country-name" validate={required} name="country" />
        <Field component={renderField} label="Which church are you from?" type="text" id="church" name="church" />
        {hasChildcare
            ? <div>
                <h2 htmlFor="childcare">{childcareTitle}</h2>
                <p>{childcareSubtitle}</p>
                <Field component={renderCheckbox} label="I Require Childcare" type="checkbox" id="childcare" name="childcare" />
                {needsChildcare
                    ? <ChildcareSection dates={dates} daysByDate={daysByDate} slots={slots} maxAge={maxAge} minAge={minAge} />
                    : undefined}
            </div>
            : undefined}
    </div>;
}

const selector = formValueSelector('personalDetails');
PersonalDetails = connect(state => {
    return {
        ...state,
        needsChildcare: selector(state, 'childcare')
    };
})(PersonalDetails);

export { PersonalDetails };
