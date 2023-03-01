<template>
    <v-row style="margin: 2% 0;">
        <label>Upload image</label>
    </v-row>
    <div class="file-upload">
        <div class="file-upload__area">
            <div v-if="!file.isUploaded">
                <input type="file" name="" id="" accept="image/*" @change="handleFileChange($event)" />
                <div v-if="errors.length > 0">
                    <div class="file-upload__error" v-for="(error, index) in errors" :key="index">
                        <span>{{ error }}</span>
                    </div>
                </div>
            </div>
            <div v-if="file.isUploaded" class="upload-preview">
                <img :src="file.url" v-if="file.isImage" class="file-image" alt="" />
                <div v-if="!file.isImage" class="file-extention">
                    {{ file.fileExtention }}
                </div>
                <span class="file-name">
                    {{ file.name }}{{ file.isImage ? `.${file.fileExtention}` : "" }}
                </span>
                <div class="">
                    <button @click="resetFileInput">Change file</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "FileUpload",
    emits: ["file-uploaded"],
    props: {
        maxSize: {
            type: Number,
            default: 5,
            required: true,
        },
        accept: {
            type: String,
            default: "image/*",
        },
    },
    data() {
        return {
            errors: [],
            isLoading: false,
            uploadReady: true,
            file: {
                name: "",
                size: 0,
                type: "",
                fileExtention: "",
                selectedFile:null,
                url: "",
                isImage: false,
                isUploaded: false,
            },
        };
    },
    methods: {
        handleFileChange(e) {
            this.errors = [];
            if (e.target.files && e.target.files[0]) {
                if (this.isFileValid(e.target.files[0])) {
                    const file = e.target.files[0],
                        fileSize = Math.round((file.size / 1024 / 1024) * 100) / 100,
                        fileExtention = file.name.split(".").pop().toLowerCase(),
                        fileName = file.name.split(".").shift(),
                        isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtention);
                    let reader = new FileReader();
                    reader.addEventListener(
                        "load",
                        () => {
                            this.file = {
                                name: fileName,
                                size: fileSize,
                                type: file.type,
                                fileExtention: fileExtention,
                                selectedFile:file,
                                isImage: isImage,
                                url: reader.result,
                                isUploaded: true,
                            };
                            setTimeout(() => {
                                this.sendDataToParent();
                            }, 500);
                        },
                        false
                    );
                    reader.readAsDataURL(file);
                } else {
                    this.errors.push("Invalid file");
                }
            }
        },
        isFileSizeValid(fileSize) {
            if (fileSize <= this.maxSize) {
                console.assert("File size is valid");
            } else {
                this.errors.push(`File size should be less than ${this.maxSize} MB`);
            }
        },
        isFileTypeValid(fileExtention) {
            if (this.accept ? this.accept.split(",").includes(fileExtention.toLowerCase()) : ['png', 'jpg', 'jpeg'].includes(fileExtention.toLowerCase())) {
                console.assert("File type is valid");
            } else {
                this.errors.push(`File type should be ${this.accept}`);
            }
        },
        isFileValid(file) {
            this.isFileSizeValid(Math.round((file.size / 1024 / 1024) * 100) / 100);
            this.isFileTypeValid(file.name.split(".").pop());
            if (this.errors.length === 0) {
                return true;
            } else {
                return false;
            }
        },
        resetFileInput() {
            this.uploadReady = false;
            this.$nextTick(() => {
                this.uploadReady = true;
                this.file = {
                    name: "",
                    size: 0,
                    type: "",
                    data: "",
                    fileExtention: "",
                    selectedFile:null,
                    url: "",
                    isImage: false,
                    isUploaded: false,
                };
            });
        },
        sendDataToParent() {
            // this.resetFileInput();
            this.$emit("file-uploaded", this.file);
        },
    },
};
</script>
  
<style scoped>
.file-upload {
    height: auto;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}

.file-upload .file-upload__area {
    width: 600px;
    max-width: 600px;
    max-height: 600px;
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    padding: 20px;
}

.file-upload .file-upload__error {
    margin-top: 10px;
    color: #f00;
    font-size: 12px;
}

.file-upload .upload-preview {
    text-align: center;
}

.file-upload .upload-preview .file-image {
    width: 100%;
    height: 300px;
    object-fit: contain;
}

.file-upload .upload-preview .file-extention {
    height: 100px;
    width: 100px;
    max-width: 600px;
    max-height: 600px;
    border-radius: 8px;
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5em auto;
    font-size: 1.2em;
    padding: 1em;
    text-transform: uppercase;
    font-weight: 500;
}

.file-upload .upload-preview .file-name {
    font-size: 1.2em;
    font-weight: 500;
    color: #000;
    opacity: 0.5;
}
</style>