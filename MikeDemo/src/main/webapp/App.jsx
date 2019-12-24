
class App extends React.Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
            "csvURL": "",
            "zipCodeStats": this.getEmptyZipCodeStats(),
            "totPopMin": "",
            "totPopMax": "",
            "medAgeMin": "",
            "medAgeMax": "",
            "mostPopQtyLimit": "",
            "zipCodeListTitle": "",
            "zipCodeListData": [],
            "busy": false
        };
        
        this.onInputChange = this.onInputChange.bind(this);
        this.onZCSInputChange = this.onZCSInputChange.bind(this);
        this.onZCSAction = this.onZCSAction.bind(this);
        this.onQueryAction = this.onQueryAction.bind(this);
        this.onZipCodeListItemClick = this.onZipCodeListItemClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }
    
    
    render() {
        return (
            <div>
                <div className="Busy" style={{ "display": (this.state.busy ? "block" : "none") }}> </div>
                <h3>Zip Code Statistics Mini Explorer</h3>
                
                <table className="Panes">
                    <tbody>
                        <tr>
                            <td className="LeftPane">

                                <div>
                                    <button onClick={this.onUpload}>Upload CSV</button>
                                    <HSpace />
                                    <input type="text" name="csvURL" value={this.state.csvURL} placeholder="URL (blank for default)" onChange={this.onInputChange} />
                                </div>
                                
                                <br />

                                <div className="ZCSActionButtons">
                                    <button name="zcsGet" onClick={this.onZCSAction}>GET</button>
                                    <button name="zcsPut" onClick={this.onZCSAction}>PUT</button>
                                    <button name="zcsDelete" onClick={this.onZCSAction}>DELETE</button>
                                </div>

                                <table className="ZipCodeStats">
                                    <tbody>
                                        <tr>
                                            <td>ZIP Code</td>
                                            <td><input type="text" name="zip_code" data-type="ZipCode" value={this.state.zipCodeStats.zip_code} onChange={this.onZCSInputChange} /></td>
                                        </tr>
                                        <tr>
                                            <td>Total population</td>
                                            <td><input type="text" name="total_population" data-type="int" value={this.state.zipCodeStats.total_population} onChange={this.onZCSInputChange} /></td>
                                        </tr>
                                        <tr>
                                            <td>Median age</td>
                                            <td><input type="text" name="median_age" data-type="decimal" value={this.state.zipCodeStats.median_age} onChange={this.onZCSInputChange} /></td>
                                        </tr>
                                        <tr>
                                            <td>Total males</td>
                                            <td><input type="text" name="total_males" data-type="int" value={this.state.zipCodeStats.total_males} onChange={this.onZCSInputChange} /></td>
                                        </tr>
                                        <tr>
                                            <td>Total females</td>
                                            <td><input type="text" name="total_females" data-type="int" value={this.state.zipCodeStats.total_females} onChange={this.onZCSInputChange} /></td>
                                        </tr>
                                        <tr>
                                            <td>Total households</td>
                                            <td><input type="text" name="total_households" data-type="int" value={this.state.zipCodeStats.total_households} onChange={this.onZCSInputChange} /></td>
                                        </tr>
                                        <tr>
                                            <td>Avg household size</td>
                                            <td><input type="text" name="average_household_size" data-type="decimal" value={this.state.zipCodeStats.average_household_size} onChange={this.onZCSInputChange} /></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </td>

                            <td><div className="VerticalSeparator"><div></div></div></td>

                            <td className="RightPane">
                            
                                <div className="ZipCodeQueries">
                                    <div>
                                        <button name="queryTotPop" onClick={this.onQueryAction}>List by Total Population</button>
                                        <span className="WithinRange">within range</span>
                                        <span className="MinMax">
                                            <input type="text" name="totPopMin" data-type="int" placeholder="Min" value={this.state.totPopMin} onChange={this.onInputChange} />
                                            <span> - </span>
                                            <input type="text" name="totPopMax" data-type="int" placeholder="Max" value={this.state.totPopMax} onChange={this.onInputChange} />
                                        </span>
                                    </div>
                                    <div>
                                        <button name="queryMedAge" onClick={this.onQueryAction}>List by Median Age</button>
                                        <span className="WithinRange">within range</span>
                                        <span className="MinMax">
                                            <input type="text" name="medAgeMin" data-type="decimal" placeholder="Min" value={this.state.medAgeMin} onChange={this.onInputChange} />
                                            <span> - </span>
                                            <input type="text" name="medAgeMax" data-type="decimal" placeholder="Max" value={this.state.medAgeMax} onChange={this.onInputChange} />
                                        </span>
                                    </div>
                                    <div>
                                        <button name="queryMostPop" onClick={this.onQueryAction}>List by Most Populated</button>
                                        <HSpace />
                                        <input type="text" name="mostPopQtyLimit" size="6" data-type="int" placeholder="Qty limit" value={this.state.mostPopQtyLimit} onChange={this.onInputChange} />
                                    </div>
                                    <div>
                                        <button name="queryFeMaj" onClick={this.onQueryAction}>List by Female Majority</button>
                                    </div>
                                </div>
                            
                                <table>
                                    <tbody>
                                        <tr colSpan="2" className="ZipListTitle"><td>{this.state.zipCodeListTitle}</td></tr>
                                        <tr>
                                            <td>
                                                <ZipCodeList name="zipCodeList" list={this.state.zipCodeListData}
                                                        onItemClick={this.onZipCodeListItemClick} />
                                            </td>
                                            <td className="ZipListNote"><small>Click any ZIP code<br />to see its stats</small></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
        );
    }
    
    
    onInputChange(event) {
        var val = this.filterValueByDataType(event.target.value, event.target.getAttribute("data-type"));
        this.setState({ [event.target.name]: val });
    }
    
    
    onZCSInputChange(event) {
        var val = this.filterValueByDataType(event.target.value, event.target.getAttribute("data-type"));
        this.setState({ "zipCodeStats": Object.assign({}, this.state.zipCodeStats, { [event.target.name]: val }) });
    }
    
    
    onZCSAction(event) {
    
        var _zipCode = this.state.zipCodeStats.zip_code.trim();
        if (_zipCode.length === 0) {
            alert("Please enter ZIP code");
            return;
        }
        var url = "zipCodeStats/"+_zipCode;
                
        switch (event.target.name) {
            
            case "zcsGet":
                fetch(url).then(result => {
                    if (result.ok) {
                        result.json().then(body => {
                            this.setState({ "zipCodeStats": body });
                        });
                    } else {
                        this.fetchFailAlert(result);
                    }
                }).catch(error => { alert(error); });
                break;

            case "zcsPut":
                fetch(url, {
                    "method": "PUT",
                    "headers": { "Content-Type": "application/json" },
                    "body": JSON.stringify(this.state.zipCodeStats)
                }).then(result => {
                    if (result.ok) {
                        alert("PUT succeeded ("+((result.status === 201) ? "created" : "updated")+")");
                    } else {
                        this.fetchFailAlert(result);
                    }
                }).catch(error => { alert(error); });
                break;

            case "zcsDelete":
                fetch(url, { "method": "DELETE" }).then(result => {
                    if (result.ok) {
                        alert("Deletion of ZIP code "+_zipCode+" succeeded");
                        this.setState({ "zipCodeStats": this.getEmptyZipCodeStats() });
                    } else {
                        this.fetchFailAlert(result);
                    }
                }).catch(error => { alert(error); });
                break;
        }
    }
    
    
    onZipCodeListItemClick(zipCode) {
        fetch("zipCodeStats/"+zipCode).then(result => {
            if (result.ok) {
                result.json().then(body => {
                    this.setState({ "zipCodeStats": body });
                });
            } else {
                this.fetchFailAlert(result);
            }
        }).catch(error => { alert(error); });
    }
    
    
    onQueryAction(event) {
        
        switch (event.target.name) {
    
            case "queryTotPop":
                var min = parseFloat(this.state.totPopMin);
                var max = parseFloat(this.state.totPopMax);
                if (isNaN(min) || isNaN(max) || (min < 0) || (max < min)) {
                    alert("Please enter a valid range");
                    return;
                }
                fetch("getZipCodesByStatisticRange?statisticName=total_population&min="+this.state.totPopMin+"&max="+this.state.totPopMax)
                    .then(result => {
                        if (result.ok) {
                            result.json().then(body => {
                                this.setState({
                                    "zipCodeListTitle": "listed by Total Population",
                                    "zipCodeListData": body
                                });
                            });
                        } else {
                            this.fetchFailAlert(result);
                        }
                    }).catch(error => { alert(error); });
                break;
                
            case "queryMedAge":
                var min = parseFloat(this.state.medAgeMin);
                var max = parseFloat(this.state.medAgeMax);
                if (isNaN(min) || isNaN(max) || (min < 0) || (max < min)) {
                    alert("Please enter a valid range");
                    return;
                }
                fetch("getZipCodesByStatisticRange?statisticName=median_age&min="+this.state.medAgeMin+"&max="+this.state.medAgeMax)
                    .then(result => {
                        if (result.ok) {
                            result.json().then(body => {
                                this.setState({
                                    "zipCodeListTitle": "listed by Median Age",
                                    "zipCodeListData": body
                                });
                            });
                        } else {
                            this.fetchFailAlert(result);
                        }
                    }).catch(error => { alert(error); });
                break;
        
            case "queryMostPop":
                var qtyLimit = parseInt(this.state.mostPopQtyLimit);
                if (isNaN(qtyLimit) || (qtyLimit <= 0)) {
                    alert("Please enter a positive number for quantity limit");
                    return;
                }
                fetch("getZipCodesByMostPopulated?qtyLimit="+qtyLimit)
                    .then(result => {
                        if (result.ok) {
                            result.json().then(body => {
                                this.setState({
                                    "zipCodeListTitle": "listed by Most Populated",
                                    "zipCodeListData": body
                                });
                            });
                        } else {
                            this.fetchFailAlert(result);
                        }
                    }).catch(error => { alert(error); });
                break;
        
            case "queryFeMaj":
                fetch("getZipCodesByFemaleMajority").then(result => {
                    if (result.ok) {
                        result.json().then(body => {
                            this.setState({
                                "zipCodeListTitle": "listed by Female Majority",
                                "zipCodeListData": body
                            });
                        });
                    } else {
                        this.fetchFailAlert(result);
                    }
                }).catch(error => { alert(error); });
                break;
        }
    }
    
    
    onUpload() {
        this.setState({ "busy": true });
        fetch("zipCodeStats", {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify({ "csvURL": this.state.csvURL })
            }).then(result => {
                this.setState({ "busy": false });
                if (result.ok) {
                    result.json().then(body => {
                        var uploadCount = parseInt(body.uploadCount);
                        if (uploadCount > 0)
                            alert("Upload succeeded (count "+uploadCount+")");
                        else
                            alert("No valid data from URL");
                    });
                } else {
                    this.fetchFailAlert(result);
                }
            }).catch(error => { alert(error); });
    }
    
    
    getEmptyZipCodeStats() {
        return {
            "zip_code": "",
            "total_population": "",
            "median_age": "",
            "total_males": "",
            "total_females": "",
            "total_households": "",
            "average_household_size": ""
        };
    }
    
    
    filterValueByDataType(origVal, dataType) {
        var val = origVal.trim();
        switch (dataType) {

            case "int":
                val = val.replace(/[^0-9]/g,'');
                break;

            case "decimal":
                val = val.replace(/[^0-9.]/g,'');
                break;

            case "ZipCode":
                val = val.replace(/[^0-9-]/g,'');
                break;
        }
        return val;
    }
    
    
    fetchFailAlert(result) {
        result.text().then(errmsg => {
            alert("Request failed: code "+result.status+" "+result.statusText+" "+errmsg);
        });
    }
    
    
    componentDidCatch(error, info) {
        console.log(error);
    }   
    
    
}

