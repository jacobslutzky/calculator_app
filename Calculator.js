import {useState, React} from 'react';
import { StyleSheet, Text, TouchableOpacity, View,FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
export default function Calculator() {
    
    const [outputNum, setOutputNum] = useState(0)
    const [prevNum, setPrevNum] = useState(null)

    const [selectedOperator, setSelectedOperator] = useState(null)
    const [highlightOperator, setHighlightOperator] = useState(false)
    const handleNumberPressed = (num) => {
        if (selectedOperator != null && prevNum == null){
            setPrevNum(outputNum)
            setOutputNum(num)
        }
        else{
            setOutputNum(prevOutputNum=>prevOutputNum*10+num)
        }
        setHighlightOperator(false)
    }

    const clearOutputPressed = () => {
        setOutputNum(0)
        setPrevNum(null)
        setSelectedOperator(null)
        setHighlightOperator(false)
    }

    const handleOperatorSelected = (operator) => {
        if (prevNum!=null && selectedOperator != null){
            calculateOutput()
           
        }
       setHighlightOperator(true)
       setSelectedOperator(operator)
       setPrevNum(null)
    }
    const calculateOutput = () => {
        if (selectedOperator == "+"){
            setOutputNum(prevOutputNum=> prevNum + prevOutputNum)
        }
        else if (selectedOperator == "-"){
            setOutputNum(prevOutputNum=> prevNum - prevOutputNum)
        }
        else if (selectedOperator == "/"){
            setOutputNum(prevOutputNum=> Number((prevNum / prevOutputNum).toFixed(6)))
        }
        else if (selectedOperator == "x"){
            setOutputNum(prevOutputNum=> prevNum * prevOutputNum)
        }
        setSelectedOperator(null)
        setPrevNum(null)
        setHighlightOperator(false)

    }

    const ops = ["+", "-", "/","x"]
    
    function round(num) {
        num = Math.round(num + "e" + 6);
        return Number(num.tofi);
    }

  return (
    <View style={styles.container}>
    <Text style={styles.output}>
        {outputNum}
    </Text>
    <View style={{flexDirection:"row", justifyContent:"center"}}>
    <TouchableOpacity style={styles.button} onPress={()=>clearOutputPressed()}>
            <Text style={styles.buttonText}>
                C
            </Text>
        </TouchableOpacity>
    <FlatList
        data={Array(9)}
        numColumns={3}
        style={styles.list}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        renderItem={({ item: num,index }) =>  
        <TouchableOpacity style={styles.button} onPress={()=>handleNumberPressed(index+1)}>
            <Text style={styles.buttonText}>
                {index+1}
            </Text>
        </TouchableOpacity>}
    />
    <FlatList
        data={ops}
        style={styles.list}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        renderItem={({ item: operator }) =>  
        <TouchableOpacity style={[styles.button,selectedOperator==operator&&highlightOperator?{backgroundColor:"gold"}:{}]} onPress={()=>handleOperatorSelected(operator)}>
            <Text style={styles.buttonText}>
                {operator}
            </Text>
        </TouchableOpacity>}
    />
     <TouchableOpacity style={styles.button} onPress={()=>calculateOutput()}>
            <Text style={styles.buttonText}>
                =
            </Text>
        </TouchableOpacity>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  output: {
    fontSize:50,
    fontWeight:"bold"
  },
  button: {
    backgroundColor: "grey",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent:'center',
    alignItems:"center",
    margin: 3
  },
  buttonText: {
    color: "white",
    fontSize: 25
  }
});
