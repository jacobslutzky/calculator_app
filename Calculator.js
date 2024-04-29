import {useState, React} from 'react';
import { StyleSheet, Text, TouchableOpacity, View,FlatList } from 'react-native';
import Big from 'big.js';

export default function Calculator() {
    const [outputNum, setOutputNum] = useState("0")
    const [firstNum, setFirstNum] = useState(null)
    const [secondNum, setSecondNum] = useState(null)
    const [selectedOperator, setSelectedOperator] = useState(null)
    const [highlightOperator, setHighlightOperator] = useState(false)
    const [lastPressedEqual, setLastPressedEqual] = useState(false)
   
    const divisionSymbol = "\u00F7";
    const timesSymbol = "\u00D7";

    Big.NE = -7;
    Big.PE = 7;
    const handleNumberPressed = (num) => {
        if (lastPressedEqual){
            setOutputNum(num)
            setFirstNum(num)
        }
        else if (highlightOperator){
            setLastPressedEqual(false)
            setOutputNum(num)
        }
        else{
            setLastPressedEqual(false)
            if(outputNum.length < 9){
                const result = outputNum=="0"?num:outputNum+num
                setOutputNum(result)
                if(secondNum!=null){
                    setFirstNum(result)
                }
            }
        }
        setHighlightOperator(false)
        setLastPressedEqual(false)
    }
    const handleSignPressed = () => {
        const result = String(Big(outputNum).times(Big(-1)))
        setOutputNum(result)
        if (firstNum!=null&&lastPressedEqual){
            setFirstNum(result)
        }
    }

    const handlePercentPressed = () => {
        const result = String(Big(outputNum).div(Big(100)).prec(6))
        setOutputNum(result)
        if (firstNum!=null&&lastPressedEqual){
            setFirstNum(result)
        }
    }
    

    const handlePeriodPressed = () => {
        if (lastPressedEqual){
            setOutputNum("0.")
            setFirstNum("0.")
           
        }
        else if(highlightOperator){
            setOutputNum("0.")
        }
        else{
          if( outputNum.length < 9 && outputNum.indexOf(".")==-1){
            const result = outputNum + "."
            setOutputNum(result)
          }
        }
        setLastPressedEqual(false)
        setHighlightOperator(false)
    }
     
    const handleClearPressed = () => {
        setOutputNum("0")
        setFirstNum(null)
        setSecondNum(null)
        setLastPressedEqual(false)
        setSelectedOperator(null)
        setHighlightOperator(false)
    }

    const handleOperatorSelected = (operator) => {
        if (firstNum == null){
            setFirstNum(outputNum)
        }
        else if(!highlightOperator && !lastPressedEqual){
            handleEqualPressed()
           
        }
       setHighlightOperator(true)
       setSelectedOperator(operator)
       setSecondNum(null)
       setLastPressedEqual(false)
    }
    const handleEqualPressed = () => {
        const postOperatorNum = outputNum
        const result = calculateResult(firstNum, secondNum==null?outputNum:secondNum);
        if(!lastPressedEqual){
            setLastPressedEqual(true)
            setSecondNum(postOperatorNum)
        }
        setOutputNum(result)
        setFirstNum(result)
        setHighlightOperator(false)
    }

    const calculateResult = (first, second) => {
        if (selectedOperator == "+"){
            return String(Big(first).plus(Big(second)).prec(6))
        }
        else if (selectedOperator == "-"){
            return String(Big(first).minus(Big(second)).prec(6))
        }
        else if (selectedOperator == divisionSymbol){
            if(second == "0"){
                return "Error"
            }
            else{
                return String(Big(first).div(Big(second)).prec(6))
            }

        }
        else if (selectedOperator == timesSymbol){
            return String(Big(first).times(Big(second)).prec(6))
        }
    }

    const buttons = [{name: "C", type: "clear"},
                    {name: "+/-", type:"sign"},
                    {name:"%", type: "perc"},
                    {name: divisionSymbol, type:"op"},
                    {name: "7", type: "num"},
                    {name: "8", type: "num"},
                    {name:"9", type: "num"},
                    {name: timesSymbol, type:"op"},
                    {name: "4", type: "num"},
                    {name: "5", type: "num"},
                    {name:"6", type: "num"},
                    {name:"-", type:"op"},
                    {name: "1", type: "num"},
                    {name: "2", type: "num"},
                    {name:"3", type: "num"},
                    {name: "+", type:"op"},
                    {name: "0", type: "num"},
                    {name: ".", type: "per"},
                    {name: "=", type:"eq"}
                ]
  return (
    <View style={styles.container}>
    <View style={styles.outputContainer}>
        <Text style={styles.output}>
            {outputNum}
        </Text>
    </View>
    
    <FlatList
        data={buttons}
        scrollEnabled={false}
        numColumns={4}
        style={styles.list}
        contentContainerStyle={{ justifyContent: 'flex-end'}}
        renderItem={({ item: button,index }) =>  
        <TouchableOpacity style={[button.name!=0?styles.button:styles.zeroButton, 
            button.type == "op" || button.type ==  "eq"?button.name==selectedOperator&&highlightOperator?{backgroundColor:"white"}:{backgroundColor: "#e3b11c"}:["clear","sign","perc"].includes(button.type)?{backgroundColor:"#c6c3c1"}:{}]} onPress={()=> {
                if(outputNum == "Error"){
                   setFirstNum("0")
                   setOutputNum("0")
                }
                switch (button.type) {
                    case "op":
                        handleOperatorSelected(button.name);
                        break;
                    case "num":
                        handleNumberPressed(button.name);
                        break;
                    case 'eq':
                        handleEqualPressed();
                        break;
                    case 'clear':
                        handleClearPressed();
                        break;
                    case 'sign':
                        handleSignPressed();
                        break;
                    case 'perc':
                        handlePercentPressed();
                        break;
                    case 'per':
                        handlePeriodPressed();
                        break;
                }
                }}>
            <Text style={[styles.buttonText,button.name==selectedOperator&&highlightOperator?{color:"#e3b11c" }:["clear","sign","perc"].includes(button.type)?{color:"black"}:{}]}>
                {button.name}
            </Text>
        </TouchableOpacity>
        }/>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    
    
  },
  outputContainer: {
    flex: 1,
    justifyContent: 'flex-end',

    
  },
  list: {
    flex:1,
    backgroundColor: 'black',
   paddingBottom:100
  },

  output: {
    fontSize:50,
    fontWeight:"bold",
    marginRight:24,
    color:"white"
  },
  button: {
    backgroundColor: "grey",
    borderRadius: "40%",
    width: 75,
    height: 75,
    justifyContent:'center',
    alignItems:"center",
    margin: 8
  },
  zeroButton: {
    backgroundColor: "grey",
    borderRadius: "40%",
    width: 162,
    height: 75,
    justifyContent:'center',
    alignItems:"flex-start",
    paddingLeft:30,
    margin: 8,
    textAlign:"left"
  },
  buttonText: {
    color: "white",
    fontSize: 30
  },

});
