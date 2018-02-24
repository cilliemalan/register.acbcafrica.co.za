import yfgw_pretoria from './content/yfgw-pretoria-button.jpg'
import yfgw_capetown from './content/yfgw-capetown-button.jpg';
import mgw_button from './content/mgw-button.jpg';
import fgw_button from './content/fgw-button.jpg';

module.exports = {
    'yfgw-pretoria': {
        image: yfgw_pretoria,
        title: 'Your Family God\'s Way Pretoria',
        from: new Date(2018, 10, 17),
        to: new Date(2018, 10, 20),
        options: {
            pastors: {
                title: 'Pastor\'s Pre-conference',
                from: new Date(2018, 10, 16, 9, 0),
                to: new Date(2018, 10, 16, 12, 0),
                cost: 0
            },
            womens: {
                title: 'Women\'s Pre-conference',
                from: new Date(2018, 10, 17, 9, 0),
                to: new Date(2018, 10, 17, 12, 0),
                cost: 0
            },
            yfgw: {
                title: 'ACBC Africa Conference 2018',
                subtitle: 'Your Family God’s Way',
                from: new Date(2018, 10, 17, 19, 0),
                to: new Date(2018, 10, 20, 17, 0),
                cost: 350
            },
            food1: {
                title: 'Thursday Meal Option',
                subtitle: 'Italian roasted chicken, roasted vegetables and rice',
                from: new Date(2018, 10, 18),
                cost: 50
            },
            food2: {
                title: 'Friday Meal Option',
                subtitle: 'Roti with beef curry and chutney',
                from: new Date(2018, 10, 19),
                cost: 60
            }
        }
    },
    'yfgw-capetown': {
        image: yfgw_capetown,
        title: 'Your Family God\'s Way Cape Town',
        from: new Date(2018, 10, 24),
        to: new Date(2018, 10, 27),
        options: {
            yfgw: {
                title: 'ACBC Africa Conference 2018',
                subtitle: 'Your Family God’s Way',
                from: new Date(2018, 10, 24, 19, 0),
                to: new Date(2018, 10, 27, 17, 0),
                cost: 350
            }
        }
    },
    'mgw': {
        image: mgw_button,
        title: 'Mothering God\'s Way',
        from: new Date(2018, 8, 9),
        to: new Date(2018, 8, 9),
        options: {
            mothering: {
                title: 'Mothering God\'s Way',
                from: new Date(2018, 8, 9, 7, 30),
                to: new Date(2018, 8, 9, 16, 0),
                cost: 0
            }
        }
    },
    'fgw': {
        image: fgw_button,
        title: 'Fathering God\'s Way',
        from: new Date(2018, 8, 10),
        to: new Date(2018, 8, 10),
        options: {
            fathering: {
                title: 'Fathering God\'s Way',
                from: new Date(2018, 8, 10, 7, 30),
                to: new Date(2018, 8, 10, 16, 0),
                cost: 0
            }
        }
    }
}