import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";


const TagCard = (props) => {
    return (
        <div className="col-md-8">
            <div className="card" style={{ height: '24rem' }}>
                <div className="card-body card-body-scrollable card-body-scrollable-shadow">
                    <div className="divide-y"></div>
                    <span class="badge bg-blue-lt">blue</span>
                    <span class="badge bg-azure-lt">azure</span>
                    <span class="badge bg-indigo-lt">indigo</span>
                    <span class="badge bg-purple-lt">purple</span>
                    <span class="badge bg-pink-lt">pink</span>
                    <span class="badge bg-red-lt">red</span>
                    <span class="badge bg-orange-lt">orange</span>
                    <span class="badge bg-yellow-lt">yellow</span>
                </div>
            </div>
        </div>
    )
}
export default TagCard;
