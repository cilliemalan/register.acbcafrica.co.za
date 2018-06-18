import React from 'react';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import moment from 'moment';

export class ChildcareEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = { children: [{}] };
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
        this.removeClick = this.removeClick.bind(this);
        this.addClick = this.addClick.bind(this);
    }

    componentDidUpdate() {
        // TODO: check that children are not invalid.
    }

    inputUpdate(e) {
        const input = e.target;
        const selector = input.name;
        const value = input.type == "checkbox" ? input.checked : input.value;
        this.setState(state => {
            // .set is supposed to mutate. It doesn't seem to
            // but want to be safe.
            const clone = _.cloneDeep(state);
            const newv = _(state).set(selector, value).value();
            return newv;
        });
    }

    removeClick(e) {
        const anchor = e.target;
        const ix = anchor.getAttribute('data-ix');
        this.setState(state => {
            const children = [...state.children];
            children.splice(ix, 1);
            if (!children.length) {
                children.push({});
            }
            return { ...state, children };
        });
    }

    addClick(e) {
        this.setState(state => ({ ...state, children: [...state.children, {}] }));
    }

    render() {
        const { title, subtitle, days } = this.props;
        const slots = _(days)
            .flatMap(day => day.slots)
            .uniq()
            .orderBy(x => x)
            .value();
        const dates = days.map(({ date }) => date);
        const dateDays = days.map(({ date }) => moment(date).format('ddd'));
        const daysByDate = {};
        days.forEach(day => daysByDate[day.date] = day.slots);

        const child = (child, ix) =>
            <div key={ix} className="child">

                <div className="form-group child-name">
                    <label htmlFor={`child-${ix}-name`}>Child Name</label>
                    <input type="text" value={child.name || ''} onChange={this.inputUpdate} id={`child-${ix}-name`} name={`children[${ix}].name`} />
                </div>

                <div className="form-group child-age">
                    <label htmlFor={`child-${ix}-age`}>Age</label>
                    <input type="text" value={child.age || ''} onChange={this.inputUpdate} id={`child-${ix}-age`} name={`children[${ix}].age`} />
                </div>

                <div className="form-group child-slots">
                    <label>
                        {dates.map((date, d_ix) => <span key={d_ix} className="child-day">{moment(date).format('ddd')}</span>)}
                    </label>
                    <div className="child-slots-container">
                        {slots.map((slot, s_ix) => <div key={s_ix}>
                            <div className="child-slot">{slot}</div>
                            {dates.map((date, d_ix) => {
                                const value = child.days && (child.days[d_ix] || [])[s_ix] || false;
                                return <div className="child-day" key={d_ix}>
                                    {daysByDate[date].indexOf(slot) != -1 ? <input type="checkbox" onChange={this.inputUpdate} value={value} name={`children[${ix}].days[${d_ix}][${s_ix}]`} /> : undefined}
                                </div>;
                            })}
                        </div>)}
                    </div>
                </div>

                <div className="form-group child-controls">
                    <a href="javascript:void(0)" data-ix={ix} onClick={this.removeClick}>remove</a>
                </div>

            </div>;

        const childcareOptions = () => <div>
            {this.state.children.map(child)}
            <div>
                <a href="javascript:void(0)" onClick={this.addClick}>add another</a>
            </div>
        </div>;


        return <div>
            <div className="form-group">
                <label htmlFor="childcarecheck">Do you require childcare?</label>
                <input type="checkbox"
                    id="childcarecheck"
                    onChange={this.inputUpdate}
                    value={this.state.needschildcare}
                    name="needschildcare" />
                <div className="error"></div>
            </div>
            {this.state.needschildcare ? childcareOptions() : undefined}
        </div>
    }
}
