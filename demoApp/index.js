/**
 * Sample React Native App for BlinkID
 * https://github.com/BlinkID/blinkid-react-native
 */

import React, { Component } from 'react';
import * as BlinkIDReactNative from 'blinkid-react-native';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Button
} from 'react-native';

const licenseKey = Platform.select({
    // iOS license key for applicationID: org.reactjs.native.example.BlinkIDReactNative
    ios: 'sRwAAAEtb3JnLnJlYWN0anMubmF0aXZlLmV4YW1wbGUuQmxpbmtJRFJlYWN0TmF0aXZlt67qu61k2vMma/KTrphwHMvoHXMjmoOiNv6uxnbg320lcJ/RpFYDaeHwCnSmYXWbcR16T+Sp3nqKT26WY/VGUzrsYfVP8V5wefOfy+IMnMT99E2wsW0ID3GfoZmyOYnhvE9jy66qJyVWb06spHnJ35MuaIL94ySwxwlSBmjaG0vs0Nz902P0tCMTlAgAUZVfacsBrBE3LsXWbO7bm3NbX52JDBYQjGENXT9ZP9oSTPcUOdggYpIM7fDDREdm',
    // android license key for applicationID: com.blinkidreactnative
    android: 'sRwAAAAWY29tLmJsaW5raWRyZWFjdG5hdGl2ZYouOuuUS2CbdVuol25oyKRUaeMN2tXUUHsnmsYZFmU/Q4p3rKzxWcsyPbfyJOarHpp6DAV9+ZtOSJ3VPOp2DY0kN8cxu3JoD+ceI4wngSVkO0LNv9EcuHefI0C+hJ1v+g7FgF5MftcMGQhgt8W5Bvj+vsIWhtBKuVZgJJrbl1jC9/NvmXaua1RpQDZf81ycjJfZRFmSTnRQJexYdfEalCme3cjvxVs95WbROPBjAedixp5g35P7ohxQgBNj5A=='
})

var renderIf = function(condition, content) {
    if (condition) {
        return content;
    } 
    return null;
}

export default class BlinkIDReactNativeApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showImageDocument: false,
            resultImageDocument: '',
            showImageFace: false,
            resultImageFace: '',
            showSuccessFrame: false,
            successFrame: '',
            results: '',
            licenseKeyErrorMessage: ''
        };
    }

    async scan() {
        try {
            // to scan EU driver's licenses, use EudlRecognizer
            var eudlRecognizer = new BlinkIDReactNative.EudlRecognizer();
            eudlRecognizer.returnFaceImage = true;
            eudlRecognizer.returnFullDocumentImage = true;

            // if you also want to obtain camera frame on which specific recognizer has
            // finished its recognition, wrap it with SuccessFrameGrabberRecognizer and use
            // the wrapper instead of original for building RecognizerCollection
            var eudlSuccessFrameGrabber = new BlinkIDReactNative.SuccessFrameGrabberRecognizer(eudlRecognizer);

            // to scan US Driver's licenses, use UsdlRecognizer
            var usdlRecognizer = new BlinkIDReactNative.UsdlRecognizer();

            var usdlSuccessFrameGrabber = new BlinkIDReactNative.SuccessFrameGrabberRecognizer(usdlRecognizer);

            // to scan any machine readable travel document (passports, visa's and IDs with 
            // machine readable zone), use MrtdRecognizer
            var mrtdRecognizer = new BlinkIDReactNative.MrtdRecognizer();
            mrtdRecognizer.returnFullDocumentImage = true;

            var mrtdSuccessFrameGrabber = new BlinkIDReactNative.SuccessFrameGrabberRecognizer(mrtdRecognizer);

            const scanningResults = await BlinkIDReactNative.BlinkID.scanWithCamera(
                new BlinkIDReactNative.DocumentOverlaySettings(),
                new BlinkIDReactNative.RecognizerCollection([eudlSuccessFrameGrabber, usdlSuccessFrameGrabber, mrtdSuccessFrameGrabber]),
                licenseKey
            );

            if (scanningResults) {
                let newState = {
                    showImageDocument: false,
                    resultImageDocument: '',
                    showImageFace: false,
                    resultImageFace: '',
                    results: '',
                    showSuccessFrame: false,
                    successFrame: ''
                };

                for (let i = 0; i < scanningResults.length; ++i) {
                    let localState = this.handleResult(scanningResults[i]);
                    newState.showImageDocument = newState.showImageDocument || localState.showImageDocument;
                    if (localState.resultImageDocument) {
                        newState.resultImageDocument = localState.resultImageDocument;
                    }
                    newState.showImageFace = newState.showImageFace || localState.showImageFace;
                    if (localState.resultImageFace) {
                        newState.resultImageFace = localState.resultImageFace;
                    }
                    newState.results += localState.results;
                    newState.showSuccessFrame = newState.showSuccessFrame || localState.showSuccessFrame;
                    if (localState.successFrame) {
                        newState.successFrame = localState.successFrame;
                    }
                  
                }
                newState.results += '\n';
                this.setState(newState);
            }
        } catch (error) {
            console.log(error);
            this.setState({ showImageDocument: false, resultImageDocument: '', showImageFace: false, resultImageFace: '', results: 'Scanning has been cancelled', showSuccessFrame: false,
            successFrame: ''});
        }
    }

    handleResult(result) {
        let fieldDelim = ";\n";
        
        var localState = {
            showImageDocument: false,
            resultImageDocument: '',
            showImageFace: false,
            resultImageFace: '',
            results: '',
            showSuccessFrame: false,
            successFrame: ''
        };
        
        if (result instanceof BlinkIDReactNative.UsdlRecognizerResult) {
            localState.results += /** Personal information */
                "First name: " + result.firstName + fieldDelim +
                "Last name: " + result.lastName + fieldDelim +
                "Full name: " + result.fullName + fieldDelim +
                "Address: " + result.address + fieldDelim +
                "Document number: " + result.documentNumber + fieldDelim +
                "Sex: " + result.sex + fieldDelim +
                "Restrictions: " + result.restrictions + fieldDelim +
                "Endorsments: " + result.endorsements + fieldDelim +
                "Vehicle class: " + result.vehicleClass + fieldDelim +
                "Date of birth: " +
                    result.dateOfBirth.day + "." +
                    result.dateOfBirth.month + "." +
                    result.dateOfBirth.year + "." + fieldDelim + 
                 "Date of issue: " +
                    result.dateOfIssue.day + "." +
                    result.dateOfIssue.month + "." +
                    result.dateOfIssue.year + "." + fieldDelim +
                 "Date of expiry: " +
                    result.dateOfExpiry.day + "." +
                    result.dateOfExpiry.month + "." +
                    result.dateOfExpiry.year + "." + fieldDelim;
        } else if (result instanceof BlinkIDReactNative.MrtdRecognizerResult) {
            let mrtdResult = result;
            localState.results +=
                "First name: " + mrtdResult.mrzResult.secondaryId + fieldDelim +
                "Last name: " + mrtdResult.mrzResult.primaryId + fieldDelim +
                "Nationality: " + mrtdResult.mrzResult.nationality + fieldDelim +
                "Gender: " + mrtdResult.mrzResult.gender + fieldDelim +
                "Date of birth: " +
                    mrtdResult.mrzResult.dateOfBirth.day + "." +
                    mrtdResult.mrzResult.dateOfBirth.month + "." +
                    mrtdResult.mrzResult.dateOfBirth.year + ".";
            
              // Document image is returned as Base64 encoded JPEG
              if (mrtdResult.fullDocumentImage) {
                  localState.showImageDocument = true;
                  localState.resultImageDocument = 'data:image/jpg;base64,' + mrtdResult.fullDocumentImage;
              }
        } else if (result instanceof BlinkIDReactNative.EudlRecognizerResult) {
            localState.results +=
                "First name: " + result.firstName + fieldDelim +
                "Last name: " + result.lastName + fieldDelim +
                "Address: " + result.address + fieldDelim +
                "Personal number: " + result.personalNumber + fieldDelim +
                "Driver number: " + result.driverNumber + fieldDelim;
            
            // Document image is returned as Base64 encoded JPEG
            if (result.fullDocumentImage) {
                localState.showImageDocument = true;
                localState.resultImageDocument = 'data:image/jpg;base64,' + result.fullDocumentImage;
            }
        
            // Face image is returned as Base64 encoded JPEG
            if (result.faceImage) {
                localState.showImageFace = true;
                localState.resultImageFace = 'data:image/jpg;base64,' + result.faceImage;
            }
        } else if (result instanceof BlinkIDReactNative.SuccessFrameGrabberRecognizerResult) {
            // first handle slave result, and then add success frame image
            localState = this.handleResult(result.slaveRecognizerResult);
  
              // success frame is returned as Base64 encoded JPEG
            if (result.successFrame) {
                localState.showSuccessFrame = true;
                localState.successFrame = 'data:image/jpg;base64,' + result.successFrame;
            }
        }
        return localState;
    }

    render() {
        let displayImageDocument = this.state.resultImageDocument;
        let displayImageFace = this.state.resultImageFace;
        let displaySuccessFrame = this.state.successFrame;
        let displayFields = this.state.results;
        return (
        <View style={styles.container}>
            <Text style={styles.label}>MicroBlink Ltd</Text>
            <View style={styles.buttonContainer}>
            <Button
                onPress={this.scan.bind(this)}
                title="Scan"
                color="#87c540"
            />
            </View>
            <ScrollView
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}y> 
            {renderIf(this.state.showImageDocument,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showImageFace,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayImageFace, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showSuccessFrame,
                <View style={styles.imageContainer}>
                    <Image
                    resizeMode='contain'
                    source={{uri: displaySuccessFrame, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            <Text style={styles.results}>{displayFields}</Text>
            </ScrollView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50
  },
  buttonContainer: {
    margin: 20
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  results: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  imageResult: {
    flex: 1,
    flexShrink: 1,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
});

AppRegistry.registerComponent('BlinkIDReactNative', () => BlinkIDReactNativeApp);
