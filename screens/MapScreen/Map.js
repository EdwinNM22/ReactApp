import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import WebView from "react-native-webview";
import planetaHtml from '../../assets/Mapa/Planeta/planetaGoogleEarth.html'

// Imagenes
    import weatherBackground from '../../assets/Mapa/Clima/WeatherBG.png'

    // Iconos
    import planetaIcono from '../../assets/Mapa/Iconos/PlanetaIcono.png'
    import buscarIcono from '../../assets/Mapa/Iconos/BuscarIcono.png'
    
    import climaSolIcono from '../../assets/Mapa/Clima/ClimaSoleado.png'
    import climaNubesIcono from '../../assets/Mapa/Clima/ClimaNublado.png'
    import climaLluviaIcono from '../../assets/Mapa/Clima/ClimaLluvioso.png'
    import humedadIcono from '../../assets/Mapa/Clima/Humedad.png'
    import aireIcono from '../../assets/Mapa/Clima/Aire.png'

// Fonts   
import { useFonts } from "expo-font";
    import mollenPersonalRegular from '../../assets/Mapa/Fonts/mollenPersonalRegular.otf'
    import mollenPersonalBold from '../../assets/Mapa/Fonts/mollenPersonalBold.otf'
import Loading from "./Components/Loading";
        

export default function Map(){
    const [currentWeather, setWeather] = useState({
        ciudad: '',
        condicion: '',
        temperatura: ''
    })
    const [isLoadingWeather, setIsLoadingWeather] = useState(true)

    const planetRef = useRef(null)
    
    const [fontsLoaded] = useFonts({
        'MollenRegular' : mollenPersonalRegular,
        'MollenBold' : mollenPersonalBold
    })
        
    if (!fontsLoaded){
        return(
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    
    async function requestWeather(lat, lng){
        try {
            setIsLoadingWeather(true)

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=54404e2dafa21cde397237dbfa9ccb48`)
            const weatherData = await response.json()
    
            setWeather({
                ciudad: weatherData.name || "Zona no especificada",
                condicion: weatherData.weather[0].main,
                temperatura: weatherData.main.temp + "°",
                humedad: weatherData.main.humidity + "%",
                aire: weatherData.wind.speed + "km/h"
            })
            setIsLoadingWeather(false)
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
        }
    }

    return (
        <SafeAreaView style={styles.appContainer}>

            {/* Barra de busqueda */}
            {/* <LinearGradient 
                colors={['#dcdfea', '#b3b6c0']} 
                start={{ x: 0.5, y: 0 }} 
                end={{ x: 1, y: 0 }} 
                style={styles.searchContainer}
            >
                <Image source={planetaIcono} style={styles.searchIconLeft}/>

                <TextInput 
                    style={styles.searchBar}
                    placeholder="Buscar"
                />

                <Image source={buscarIcono} style={styles.searchIconRight}/>
            </LinearGradient> */}

            {/* Mapa */}
            <View style={styles.mapContainer}>
                <WebView
                    ref={planetRef}
                    source={planetaHtml}
                    startInLoadingState = {true}
                    style={styles.earth}
                    
                    onMessage={(event) =>{
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
                    
                    {/* Item 1  */}
                    <View style={styles.weatherItem}>
                        {(isLoadingWeather && currentWeather.humedad) 
                            ? <Loading/>
                            : <>
                                <Text style={styles.weatherLabel}>
                                    Humedad
                                </Text>

                                {currentWeather.humedad 
                                    ? <Image source={humedadIcono} style={styles.humidtyIcon}/>
                                    : <Text>...</Text>
                                }

                                <Text style={styles.weatherTemperature}>
                                    {currentWeather.humedad
                                        ? currentWeather.humedad  
                                        : ".."
                                    }
                                </Text>
                              </>
                        }
                    </View>

                    {/* Item 2 */}
                    <View style={styles.weatherItem}>
                        <Text style={styles.weatherLabel}>
                            Temperatura
                        </Text>

                        {currentWeather.condicion 
                            ? <Image source={getWeatherIcon()} style={styles.weatherIcon}/>
                            : <Text>...</Text>
                        }

                        <Text style={styles.weatherTemperature}>
                            {currentWeather.temperatura
                                ? currentWeather.temperatura  
                                : ".."
                            }
                        </Text>
                    </View>

                    {/* Item 3 */}
                    <View style={styles.weatherItem}>
                        <Text style={styles.weatherLabel}>
                            Aire
                        </Text>

                        {currentWeather.aire 
                            ? <Image source={aireIcono} style={styles.humidtyIcon}/>
                            : <Text>...</Text>
                        }

                        <Text style={styles.weatherTemperature}>
                            {currentWeather.aire
                                ? currentWeather.aire  
                                : ".."
                            }
                        </Text>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    appContainer:{
        flex:1,
    },

    /// Barra de busqueda
    searchContainer:{
        display:'flex',
        flexDirection:'row',

        width:'75%',
        height:'5%',
        position:'absolute',
        alignSelf:'center',
        alignItems:'center',
        
        top:'25%',
        
        borderRadius:22.5,

        zIndex:1
    },
    searchBar:{
        flex:1,
        marginLeft:'5%',
        padding:4,

        fontSize:16,
        fontFamily:'MollenBold',
    },
    searchIconLeft:{
        width:20,
        height:20,

        marginLeft:'7.5%'
    },
    searchIconRight:{
        width:20,
        height:20,

        marginRight:'7.5%'
    },

    /// Mapa
    mapContainer:{
        position:'absolute',
        width:'100%',
        height:'75%',
    },

    /// Weather
    weatherContainer:{
        flex:0.325,
        width:'100%',
        height:'100%',
        marginTop:'auto',
        alignItems:'center',

    },
    weatherHeader:{
        marginTop:'12.5%',
        marginBottom:'5%',

        fontSize:25,
        fontFamily:'MollenBold',

        zIndex:1
    },
    weatherItemsContainer:{
        display:'flex',
        flexDirection:'row',    
        gap:50
    },
        weatherItem:{
            alignItems:'center'
        },
        weatherLabel:{
            marginTop:"10%",
            marginBottom:"5%",
            right:2.5,

            fontFamily:'MollenBold',
            fontSize:10
        },
        weatherIcon:{
            width:60,
            height:60,
        },
        humidtyIcon:{
            width:60,
            height:60,
            transform: [{ scale: 0.8 }],
        },
        weatherTemperature: {
            width: 80,

            textAlign: 'center',
            fontFamily: 'MollenBold',
            fontSize: 18
        },
    weatherBackground:{
        position:'absolute',
        width: 385,
        height: 385,
        
        zIndex:0
    },
        
})