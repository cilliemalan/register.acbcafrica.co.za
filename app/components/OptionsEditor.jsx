import React from 'react';
import { formatCost, formatDate, formatSingleDate } from '../helpers/formatting';

export class OptionsEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { total: undefined, value: {} };
        if (this.props.options) {
            Object.keys(this.props.options)
                .forEach(key => this.state.value[key] = false);
        }

        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.itemSelectedChanged = this.itemSelectedChanged.bind(this);
        this.recalculateTotal = this.recalculateTotal.bind(this);
        this.suboptionSelectedChanged = this.suboptionSelectedChanged.bind(this);
        this._fireOnChange = this._fireOnChange.bind(this);
    }

    componentWillReceiveProps(props) {
        const newoptions = props.options;
        const soptions = this.state.value;
        const soptionsKeys = Object.keys(soptions);

        if (newoptions) {
            const newOpts = {};
            Object.keys(newoptions)
                .filter(key => !soptionsKeys.includes(key))
                .forEach(key => { newOpts[key] = false; });
            this.setState(state => ({
                ...state,
                value: {
                    ...state.value,
                    ...newOpts
                }
            }));
        }
    }

    recalculateTotal(options) {

        const calculateCostForOption = (option) => {
            const optionProps = this.props.options[option];
            const optionValue = options[option];

            const optionDefaultCost =
                isFinite(optionProps.cost)
                    ? optionProps.cost
                    : 0;

            const optionSelectedCost =
                typeof optionValue == "string"
                    ? optionProps.options[optionValue].cost
                    : 0;

            return optionValue
                ? optionDefaultCost + optionSelectedCost
                : 0;
        }

        return Object.keys(options)
            .filter(option => options[option])
            .reduce((acc, option) => (acc || 0) + calculateCostForOption(option),
                undefined);
    }

    _fireOnChange() {
        this.props.input.onChange({ ...this.state.value, total: this.state.total })
    }

    itemSelectedChanged(e) {
        const checkbox = e.target;
        const option = checkbox.name.match(/^chk-(.+)$/)[1];

        if (option) {
            const suboptions = this.props.options[option].options;
            const firstsubopt = suboptions && Object.keys(suboptions)[0];
            const checked = checkbox.checked
                ? (suboptions ? firstsubopt : true)
                : false;

            this.setState((state) => {
                const value = {
                    ...state.value,
                    [option]: checked
                };
                return {
                    ...state,
                    value,
                    total: this.recalculateTotal(value)
                };
            }, this._fireOnChange);

        }
    }

    suboptionSelectedChanged(e) {
        const radio = e.target;
        const [_, option, suboption] = radio.id.match(/^so-(.+)-(.+)$/);
        const checkedvalue = option && radio.checked && suboption;

        if (checkedvalue) {
            if (this.state.value[option] != checkedvalue) {
                this.setState((state) => {
                    const value = {
                        ...state.value,
                        [option]: checkedvalue
                    };
                    return {
                        ...state,
                        value,
                        total: this.recalculateTotal(value)
                    };
                }, this._fireOnChange);
            }
        }
    }

    clickedItem(e) {
        if (e.target.type != 'checkbox' && !/\bcss-label\b/.test(e.target.className)) {
            if (!e.target.matches('.details > ul.suboptions,.details > ul.suboptions *')) {
                const checkbox = e.currentTarget.querySelector('[type=checkbox]');
                checkbox.focus();
                checkbox.click();
            }
        }
    }

    render() {

        const poptions = this.props.options;
        const soptions = this.state.value;
        const optionkeys = Object.keys(poptions);
        const { error, touched } = this.props.meta;
        const { onFocus, onBlur } = this.props.input;

        return <div ref={this._ref}>
            <h2>Conference Options</h2>
            <p>Please select all that apply.</p>
            <ul className='conference-items'>
                {optionkeys.map(key => {
                    const option = poptions[key];
                    const selectedvalue = soptions[key];
                    const suboptions = option.options;
                    const suboptionkeys = suboptions && Object.keys(suboptions);
                    const formattedDate = formatDate(option.from, option.to);
                    const formattedCost = formatCost(option.cost);

                    const render_suboptions = () => <ul className="suboptions">
                        {suboptionkeys.map(suboptionkey => {
                            const suboption = suboptions[suboptionkey];
                            const i_name = `so-${key}`;
                            const i_id = `so-${key}-${suboptionkey}`;
                            const formattedCost = formatCost(suboption.cost);

                            return <li key={suboptionkey}>
                                <input type="radio"
                                    name={i_name}
                                    checked={suboptionkey == selectedvalue}
                                    onChange={this.suboptionSelectedChanged}
                                    id={i_id} />
                                <label htmlFor={i_id} className="subopt-title">{suboption.title} (<strong>{formattedCost}</strong>)</label>
                            </li>;
                        })}
                    </ul>;

                    return <li key={key} onClick={this.clickedItem}>
                        <div className="details">
                            <div className="title">{option.title}</div>
                            { option.subtitle && <div className="subtitle">{option.subtitle}</div> }
                            <div className="date">{formattedDate}</div>
                            {selectedvalue && suboptionkeys ? render_suboptions() : undefined}
                            {formattedCost && <div className="cost"><label>Cost:&nbsp;</label>{formattedCost}</div>}
                        </div>
                        <div className="selected">
                            <input type="checkbox"
                                className='css-checkbox'
                                name={`chk-${key}`}
                                id={`chk-${key}`}
                                checked={selectedvalue}
                                onFocus={onFocus}
                                onBlur={() => onBlur()}
                                onChange={this.itemSelectedChanged} />
                            <label htmlFor={`chk-${key}`}
                                className='css-label'>
                                Select
                            </label>
                        </div>
                    </li>;
                })}
            </ul>
            <div className="total">
                <label>Total Cost:&nbsp;</label>
                {formatCost(this.state.total)}
            </div>
            <div className="error">
                {touched && error}
            </div>
        </div>;
    }
}