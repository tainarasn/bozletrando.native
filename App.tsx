import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from "react"
import { Alert, BackHandler, StyleSheet, Text, View } from "react-native"
import * as SplashScreen from "expo-splash-screen"
import { Camera } from "expo-camera"
import { PaperProvider } from "react-native-paper"
import WebView from "react-native-webview"

SplashScreen.preventAutoHideAsync()

const App = () => {
    const webViewRef = useRef(null)
    const [progress, setProgress] = useState(0)
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)

    const INJECTEDJAVASCRIPT = `(function() {
        const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
      })();
      `

    const onLoaded = async () => {
        // await SplashScreen.hideAsync()
        setTimeout(async () => await SplashScreen.hideAsync(), 1000)
    }

    const onError = () => {
        Alert.alert("Erro", "Falha ao conectar com o servidor, verifique sua conexão com a internet e tente novamente.", [
            { text: "Fechar", onPress: () => BackHandler.exitApp() },
        ])
    }

    useEffect(() => {
        if (hasPermission === false) {
            Alert.alert(
                "Permissão necessária",
                "Seu dispositivo não está permitindo acesso a câmera. Você pode corrigir isso nos ajustes do seu dispositivo"
            )
        }
    }, [hasPermission])

    useEffect(() => {
        ;(async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === "granted")
        })()
    }, [])

    useEffect(() => {
        const backAction = () => {
            // @ts-ignore
            webViewRef.current?.goBack()
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

        return () => backHandler.remove()
    }, [])

    return (
        <PaperProvider>
            <StatusBar style="dark" hidden />
            {/* {!loaded && <SplashLoading progress={progress} />} */}
            <WebView
                ref={webViewRef}
                source={{ uri: "http://192.168.15.30:5173/" }}
                style={{ flex: 1 }}
                // containerStyle={{ display: loaded ? "flex" : "none" }}
                allowFileAccess
                mediaCapturePermissionGrantType="grant"
                mediaPlaybackRequiresUserAction={false}
                textZoom={100}
                onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                onLoad={onLoaded}
                onError={onError}
                allowsInlineMediaPlayback
                injectedJavaScript={INJECTEDJAVASCRIPT}
                onMessage={() => {}}
            />
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})

export default App