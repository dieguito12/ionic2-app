import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { MoviesProvider } from '../../providers/movies-provider';

declare var File;
declare var FileTransfer;
declare var FileUploadOptions;
declare var cordova: any;

declare var window;

var currentImage;

var theImage;

var fromLibrary;

@Component({
    selector: 'page-camera',
    templateUrl: 'camera.html',
    providers: [MoviesProvider],
})
export class CameraPage {

    public loadProgress: any = 0;

    public ft = new FileTransfer();

    constructor(public navCtrl: NavController, public moviesProvider: MoviesProvider) {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            console.log("Ready");
        }
    }
    cameraTakePicture() {
        Camera.getPicture({ 
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA
        }).then(this._onSuccess, this._onFail);
    }

    searchPicture() {
        fromLibrary = true;
        Camera.getPicture({
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        }).then(this._onSuccess, this._onFail);
    }

    _onSuccess(imageData) {
        var image = <HTMLImageElement>document.getElementById('myImage');
        image.src = imageData;
        theImage = new Object();
        theImage = imageData;
        window.resolveLocalFileSystemURL(imageData, function(fileEntry){
            currentImage = fileEntry.name;
        }, function(error){
            console.log(error);
        });
        var button = <HTMLButtonElement>document.getElementById('uploadPicture');
        button.className = button.className.replace("hide", "show");
    }
    
    _onFail(message) {
        alert('Failed because: ' + message);
    }

    uploadPicture() {
        this._uploadImage(currentImage, theImage, fromLibrary);
    }

    _uploadImage(image, theImage, fromLibrary = false) {
        var win = function (r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            var progressDiv = document.getElementById('progressDiv');
            var progressBar = <HTMLDivElement>document.getElementById('progressBar');
            progressBar.innerText = "0%";
            progressBar.className = "progress-inner fifteen";
            progressDiv.className = "hide";
        }

        var fail = function (error) {
            console.log(error);
        }

        var uri = encodeURI("http://45.55.77.201:8084/image");
        
        var options = new FileUploadOptions();
        options.fileKey = "image";
        if (fromLibrary) {
            image = image + ".jpg";
            image = image.replace(":", "_");
        }
        options.fileName = image;
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.httpMethod = 'POST';


        this.ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                this.loadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                var progressBar = <HTMLDivElement>document.getElementById('progressBar');
                var progressDiv = <HTMLDivElement>document.getElementById('progressDiv');
                progressDiv.className = "show";
                progressBar.innerText = this.loadProgress + "%";
                var className;
                if (this.loadProgress < 10) {
                    className = "fifteen";
                }
                else if (this.loadProgress < 20 && this.loadProgress > 10) {
                    className = "twenty";
                }
                else if (this.loadProgress < 30 && this.loadProgress > 20) {
                    className = "thirty";
                }
                else if (this.loadProgress < 40 && this.loadProgress > 30) {
                    className = "fourty";
                }
                else if (this.loadProgress < 50 && this.loadProgress > 40) {
                    className = "fifty";
                }
                else if (this.loadProgress < 60 && this.loadProgress > 50) {
                    className = "sixty";
                }
                else if (this.loadProgress < 70 && this.loadProgress > 60) {
                    className = "seventy";
                }
                else if (this.loadProgress < 80 && this.loadProgress > 70) {
                    className = "eighty";
                }
                else if (this.loadProgress < 90 && this.loadProgress > 80) {
                    className = "ninety";
                }
                else {
                    className = "hundred";
                }
                progressBar.className = 'progress-inner ' + className;
            }
        };
        this.ft.upload(theImage, uri, win, fail, options);
    }
}