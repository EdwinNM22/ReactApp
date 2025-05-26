import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import WebView from "react-native-webview";
import planetaHtml from '../../assets/Mapa/Planeta/planetaGoogleEarth.html'

// Imagenes
    import weatherBackground from '../../assets/Mapa/Clima/WeatherBG.png'

    // Iconos
    import climaSolIcono from '../../assets/Mapa/Clima/ClimaSoleado.png'
    import climaNubesIcono from '../../assets/Mapa/Clima/ClimaNublado.png'
    import climaLluviaIcono from '../../assets/Mapa/Clima/ClimaLluvioso.png'
    import humedadIcono from '../../assets/Mapa/Clima/Humedad.png'
    import aireIcono from '../../assets/Mapa/Clima/Aire.png'

// Fonts   
import { useFonts } from "expo-font";
    import mollenPersonalRegular from '../../assets/Mapa/Fonts/mollenPersonalRegular.otf'
    import mollenPersonalBold from '../../assets/Mapa/Fonts/mollenPersonalBold.otf'
import Wait from "./Components/Wait";
        

export default function Map(){
    const [currentWeather, setWeather] = useState({
        ciudad: '',
        condicion: '',
        temperatura: ''
    })
    const [isWaiting, setIsWaiting] = useState(true)

    const planetRef = useRef(null)
    
    const [fontsLoaded] = useFonts({
        'MollenRegular' : mollenPersonalRegular,
        'MollenBold' : mollenPersonalBold
    })
        
    if (!fontsLoaded){
        return(<Wait/>)
    }
    
    async function requestWeather(lat, lng){
        try {
            setIsWaiting(true)

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=54404e2dafa21cde397237dbfa9ccb48`)
            const weatherData = await response.json()
    
            setWeather({
                ciudad: weatherData.name || "Zona no especificada",
                condicion: weatherData.weather[0].main,
                temperatura: weatherData.main.temp + "°",
                humedad: weatherData.main.humidity + "%",
                aire: weatherData.wind.speed + "km/h"
            })
            setIsWaiting(false)
        } catch (error) {
            console.error(error)
        }
    }

    function getWeatherIcon(){
        switch (currentWeather.condicion) {
            case "Clear":
                return climaSolIcono
            case "Clouds":
                return climaNubesIcono
            case "Rain":
                return climaLluviaIcono
            default:
                return climaNubesIcono
        }
    }

    return (
         <SafeAreaView style={styles.appContainer}>
            {/* Mapa*/}
            <View style={styles.mapContainer}>
                <WebView
                    ref={planetRef}
                    source={planetaHtml}
                    startInLoadingState={true}
                    style={styles.earth}
                    onMessage={(event) => {
                        const {lat, lng} = JSON.parse(event.nativeEvent.data)
                        requestWeather(lat, lng)
                    }}
                />
            </View>

            {/* Informacion de clima */}
            <View style={styles.weatherContainer}>
                {/* Fondo  */}
                <Image
                    source={weatherBackground}
                    style={styles.weatherBackground}
                    />

                {/* Header  */}
                <Text style={styles.weatherHeader}>
                    {currentWeather.ciudad
                        ? currentWeather.ciudad 
                        : "Selecciona una ciudad"
                    }
                </Text>
            
                {/* Contenedor de items  */}
                <View style={styles.weatherItemsContainer}>

                    {/* Item 1 */}
                    <View style={styles.weatherItem}>
                    <Text style={styles.weatherLabel}>Humedad</Text>
                    
                    {isWaiting || !currentWeather.humedad 
                        ? (<Wait />) 
                        : (<>
                            <Image 
                                source={humedadIcono} 
                                style={styles.humidtyIcon} 
                            />
                            
                            <Text style={styles.weatherText}>
                                {currentWeather.humedad || ".."}
                            </Text>
                            </>
                        )}
                    </View>
                    
                    {/* Item 2 */}
                    <View style={styles.weatherItem}>
                    <Text style={styles.weatherLabel}>Temperatura</Text>

                    {isWaiting || !currentWeather.temperatura 
                        ? (<Wait />) 
                        : (<>
                            <Image 
                                source={getWeatherIcon()} 
                                style={styles.weatherIcon} 
                            />
                            
                            <Text style={styles.weatherText}>
                                {currentWeather.temperatura || ".."}
                            </Text>
                            </>
                        )}
                    </View>
                    
                    {/* Item 3 */}
                    <View style={styles.weatherItem}>
                    <Text style={styles.weatherLabel}>Aire</Text>
                    
                    {isWaiting || !currentWeather.aire 
                        ? (<Wait />) 
                        : (<>
                            <Image 
                                source={aireIcono} 
                                style={styles.weatherIcon} 
                            />
                            
                            <Text style={styles.weatherText}>
                                {currentWeather.aire || ".."}
                            </Text>
                            </>
                        )}
                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    /// Mapa 
    mapContainer: {
        flex: 1,  
        width: '100%',
        height: '100%',
    },
    earth: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    /// Weather 
    weatherContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 20,
        alignItems: 'center',
    },
    weatherHeader: {
        width: 'auto',
        height:'auto',
        paddingHorizontal:10,
        paddingVertical:2.5,
        marginTop: 20,
        marginBottom: 15,
        textAlign:'center',
        fontSize: 20,
        fontFamily: 'MollenBold',
        color: '#333',
        backgroundColor: 'rgba(255,255,255,0.85)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    weatherItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        paddingHorizontal: 10,
        flexWrap: 'wrap',
    },
    weatherItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 15,
        padding: 15,
        minWidth: 100,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 10,
    },
    weatherLabel: {
        marginBottom: 8,
        fontFamily: 'MollenBold',
        fontSize: 12,
        color: '#555',
    },
    weatherIcon: {
        width: 50,
        height: 50,
        marginVertical: 5,
    },
    humidtyIcon: {
        width: 50,
        height: 50,
        marginVertical: 5,
    },
    weatherText: {
         textAlign: 'center',
        fontFamily: 'MollenBold',
        fontSize: 18,
        color: '#222',
        marginTop: 5,
    },
    weatherBackground: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.7,
        zIndex: -1,
    },
});