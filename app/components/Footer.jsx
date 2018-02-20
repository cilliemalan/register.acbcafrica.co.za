import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = (props) =>
    <div>
        <div class="aboveFooter">
        </div>
        <div class="footer">
            <div>
                <div className="copyright">
                    Copyright {(new Date().getFullYear())} &copy; ACBC Africa
                </div>
                <div className="terms">
                    <Link to="/terms-and-conditions/">Terms &amp; Conditions</Link>
                    <Link to="/privacy-policy/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    </div>