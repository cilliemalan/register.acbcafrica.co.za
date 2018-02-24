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
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Cost</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(this.state.options).map(key => {
                        const option = this.state.options[key];
                        const formattedDate = formatDate(option.from, option.to);
                        const formattedCost = formatCost(option.cost);
                        return <tr key={key}>
                            <td>{option.title}</td>
                            <td>{formattedDate}</td>
                            <td>{formattedCost}</td>
                            <td>
                                <input type="checkbox"
                                    name={`chk-${key}`}
                                    id={`chk-${key}`}
                                    checked={option.selected}
                                    onChange={this.itemSelectedChanged} />
                            </td>
                        </tr>;
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td>{formatCost(this.state.total)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>;
    }
}