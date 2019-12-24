
class ZipCodeListItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    
    render() {
        return (
            <li className="ZipCodeListItem" onClick={this.onClick}>
                {this.props.zipCode}
            </li>
        );
    }
    
    
    onClick(event) {
        this.props.onClick(this.props.zipCode);
    }
    
    
    componentDidCatch(error, info) {
        console.log(error);
    }    
    
    
}
