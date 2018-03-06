import React from 'react';
import { formatCost, formatDate, formatSingleDate } from '../helpers/formatting';

export class OptionsEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { total: 0, value: {} };
        if (this.props.options) {
            Object.keys(this.props.options)
                .forEach(key => this.state.value[key] = false);
        }

        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.itemSelectedChanged = this.itemSelectedChanged.bind(this);
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

    itemSelectedChanged(e) {
        const option = e.target.name.match(/^chk-(.+)$/)[1];
        const checked = e.target.checked;

        const recalculateTotal = (options) =>
            Object.keys(options)
                .reduce((acc, option) =>
                    acc + (options[option]
                        ? this.props.options[option].cost
                        : 0),
                    0);

        if (option) {

            this.setState((state) => {
                const value = {
                    ...state.value,
                    [option]: checked
                };
                return {
                    ...state,
                    value,
                    total: recalculateTotal(value)
                };
            }, () => this.props.input.onChange({ ...this.state.value, total: this.state.total }));

        }
    }

    clickedItem(e) {
        if (e.target.type != 'checkbox' && !/\bcss-label\b/.test(e.target.className)) {
            const checkbox = e.currentTarget.querySelector('[type=checkbox]');
            checkbox.focus();
            checkbox.click();
        }
    }

    render() {

        const poptions = this.props.options;
        const soptions = this.state.value;
        const optionkeys = Object.keys(poptions);
        const { error, touched } = this.props.meta;
        const { onFocus, onBlur } = this.props.input;

        return <div>
            <h2>Conference Options</h2>
            <p>Please select all that apply.</p>
            <ul className='conference-items'>
                {optionkeys.map(key => {
                    const option = poptions[key];
                    const selected = soptions[key];
                    const formattedDate = formatDate(option.from, option.to);
                    const formattedCost = formatCost(option.cost);
                    return <li key={key} onClick={this.clickedItem}>
                        <div className="details">
                            <div className="title">{option.title}</div>
                            <div className="date">{formattedDate}</div>
                            <div className="cost"><label>Cost:&nbsp;</label>{formattedCost}</div>
                        </div>
                        <div className="selected">
                            <input type="checkbox"
                                className='css-checkbox'
                                name={`chk-${key}`}
                                id={`chk-${key}`}
                                checked={selected}
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