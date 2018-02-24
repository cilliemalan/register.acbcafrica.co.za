import React from 'react';
import moment from 'moment';

export class ConferenceItemDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...props, total: 0 };
        const options = this.state.options || (this.state.options = {});
        const items = Object.keys(options);
        if (items.length == 1) {
            options[items[0]].selected = true;
        } else if (items.length > 1) {
            items.forEach(opt => {
                options[opt].selected = false;
            });
        }

        this.recalculateTotal = this.recalculateTotal.bind(this);
        this.itemSelectedChanged = this.itemSelectedChanged.bind(this);
    }

    recalculateTotal() {
        let total = 0;
        Object.values(this.state.options)
            .filter(x => x.selected)
            .forEach(x => total += x.cost);
        this.setState({ total });
    }

    itemSelectedChanged(e) {
        const options = this.state.options;
        const optionKey = e.target.name.match(/^chk-(.+)$/)[1];
        const option = options[optionKey];
        this.setState({
            options: {
                ...options,
                [optionKey]: {
                    ...option,
                    selected: !option.selected
                }
            }
        }, this.recalculateTotal);

        this.recalculateTotal();

        if (this.props.onChange) {
            this.props.onChange(this.state);
        }
    }

    clickedItem(e) {
        if (e.target.type != 'checkbox' &&
            !/\bcss-label\b/.test(e.target.className)) {
            e.currentTarget.querySelector('[type=checkbox]').click();
        }
    }

    render() {
        const formatSingleDate = (date) => {
            const dateOnly = date.getHours() == 0 &&
                date.getMinutes() == 0 &&
                date.getSeconds() == 0 &&
                date.getMilliseconds() == 0;

            return dateOnly ? moment(date).format('dddd D MMMM')
                : moment(date).format('ddd D MMM HH:mm');
        };
        const formatDate = (from, to) => {
            return to ? `${formatSingleDate(from)} — ${formatSingleDate(to)}`
                : `${formatSingleDate(from)}`;
        };
        const formatCost = (a) => {
            if (typeof a == 'number') {
                if (a == 0) {
                    return 'Free';
                } else {
                    return a.toLocaleString('en-ZA', {
                        style: 'currency',
                        currency: 'ZAR',
                    });
                }
            } else {
                return '';
            }
        }
        return <div>
            <h2>Conference Options</h2>
            <p>Please select all that apply.</p>
            <ul className='conference-items'>
                {Object.keys(this.state.options).map(key => {
                    const option = this.state.options[key];
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
                                checked={option.selected}
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
        </div>;
    }
}