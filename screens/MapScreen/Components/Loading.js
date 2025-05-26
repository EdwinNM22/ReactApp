import { StyleSheet, Text } from "react-native";

export default function Loading(){
    return(
        <Text style={styles.text}>Loading</Text>
    )
}

const styles = StyleSheet.create({
    text:{
        margin:'auto'
    }
})