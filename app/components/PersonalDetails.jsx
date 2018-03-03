import React from 'react';


export class PersonalDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...props };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        const item = e.target.name;
        const value = e.target.value;
        this.setState({ [item]: value });
        if (this.props.onChange) {
            this.props.onChange(this.state);
        }
    }

    render() {
        return <div>
            <h2>Personal Information</h2>
            <p>Please the personal information for the registrant.</p>
            <div className="form-group required">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" autocomplete="honorific-prefix" name="title" />
            </div>
            <div className="form-group required">
                <label htmlFor="firstname">First name</label>
                <input type="text" id="firstname" autocomplete="given-name" name="firstname" />
            </div>
            <div className="form-group required">
                <label htmlFor="lastname">Last name</label>
                <input type="text" id="lastname" autocomplete="family-name" name="lastname" />
            </div>
            <div className="form-group required">
                <label htmlFor="contactNumber">Contact Number</label>
                <input type="text" id="contactNumber" autocomplete="tel" name="contactNumber" />
            </div>
            <div className="form-group required">
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" autocomplete="email" name="email" />
            </div>
            <div className="form-group required">
                <label htmlFor="country">From which country are you?</label>
                <input type="text" id="country" autocomplete="country-name" name="country" />
            </div>
            <div className="form-group">
                <label htmlFor="church">From which church are you?</label>
                <input type="text" id="church" name="church" />
            </div>
        </div>;
    }
}