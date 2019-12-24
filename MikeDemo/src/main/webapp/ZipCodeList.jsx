
/* global React, ZipCodeListItem */

class ZipCodeList extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    
    render() {
        return (
            <ul className="ZipCodeList">
                {this.renderListItems()}
            </ul>
        );
    }
    
    
    renderListItems() {
        const eles = [];
        for (var zipCode of this.props.list) {
            eles.push( React.createElement(ZipCodeListItem, { "key": nextReactAutoKey(), "zipCode": zipCode,
                    "onClick": this.props.onItemClick } ) );
        }
        return eles;
    }
    

    componentDidCatch(error, info) {
        console.log(error);
    }    
    
    
}
