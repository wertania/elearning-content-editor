<template>
  <AppLayout :hide-sidebar="true">
    <template #logo>
      <img
        :src="logoUrl"
        class="w-full cursor-pointer"
        @click="router.push({ name: 'edit' })"
      />
    </template>

    <template #appname>
      <div class="flex align-items-center">
        <h2>
          {{ appName + ' ' }}
        </h2>
        <h4 class="ml-2">> Screen Recorder</h4>
      </div>
    </template>

    <template #content>
      <div>
        <Toolbar>
          <template #start>
            <Button
              @click="startRecording"
              icon="fa-solid fa-clapperboard"
              label="Start recording"
              class="mr-2"
              :disabled="videoUrl != null || recordingActive || loading"
            />
            <Button
              @click="pauseRecording"
              icon="fa-solid fa-pause"
              :label="pauseActive ? 'Resume' : 'Pause'"
              class="mr-2"
              v-show="recordingActive"
              :severity="pauseActive ? 'error' : 'warning'"
            />
            <Button
              @click="stopRecording"
              icon="fa-solid fa-stop"
              label="Aufnahme beenden"
              class="mr-2"
              v-show="recordingActive"
            />
            <Button
              @click="discardRecording"
              icon="fa-solid fa-trash"
              label="Aufnahme verwerfen"
              v-show="videoUrl"
              :disabled="loading"
            />
          </template>

          <template #end>
            <Button
              @click="router.push({ name: 'edit' })"
              icon="fa-solid fa-arrow-left"
              label="Editor"
              class="mr-2"
              :disabled="loading || recordingActive"
            />
            <Button
              @click="router.push({ name: 'smart-video-dashboard' })"
              icon="fa-solid fa-arrow-left"
              label="Video Dashboard"
              class="mr-2"
              :disabled="loading || recordingActive"
            />
            <Button
              @click="uploadRawVideo"
              icon="fa-solid fa-check"
              label="Upload and Transcribe"
              class="mr-2"
              :disabled="loading || recordingActive"
              v-if="videoUrl"
            />
          </template>
        </Toolbar>
        <div class="card w-full text-center mt-5" v-if="videoUrl">
          <div class="w-10 mb-3 flex align-items-center text-center m-auto">
            <span>
              <i class="fa-solid fa-video"></i>
              Title
            </span>
            <InputText
              v-model="videoTitle"
              placeholder="Video title"
              class="w-full"
            />
          </div>
          <video
            :src="videoUrl"
            controls
            style="max-height: 70vh"
            class="w-10"
          ></video>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from './../components/AppLayout.vue';
import { ref, Ref } from 'vue';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import { dataProvider } from '@/services/data/';

const logoUrl =
  import.meta.env.VITE_TEMPLATE_LOGO_URL ?? './../assets/logo.png';
const router = useRouter();
const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';

const mediaRecorder: Ref<MediaRecorder | null> = ref(null);
const videoUrl: Ref<string | null> = ref(null);
const videoFile: Ref<File | null> = ref(null);
const recordedChunks: BlobPart[] = [];

const loading = ref(false);
const recordingActive = ref(false);
const pauseActive = ref(false);

/**
 * generate a video title with timestamp
 * no dots and spaces allowed
 * starts with recording_
 */
const generateVideoTitle = () => {
  const date = new Date();
  const timestamp = date.getTime();
  return `recording_${timestamp}`;
};
const videoTitle = ref(generateVideoTitle());

/**
 * Start the recording
 * tries also to get users permissions
 */
const startRecording = async () => {
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const tracks = [
      ...displayStream.getTracks(),
      ...audioStream.getAudioTracks(),
    ];
    const stream = new MediaStream(tracks);

    mediaRecorder.value = new MediaRecorder(stream);
    mediaRecorder.value.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };
    mediaRecorder.value.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });

      videoFile.value = new File([blob], `${videoTitle.value}.webm`, {
        type: 'video/webm',
      });

      const url = URL.createObjectURL(blob);
      videoUrl.value = url;
      // reset
      recordedChunks.length = 0;
    };
    mediaRecorder.value.start();
    recordingActive.value = true;
  } catch (error) {
    console.error('Fehler bei der Bildschirmaufnahme:', error);
    recordingActive.value = false;
  }
};

/**
 * Pause the recording
 */
const pauseRecording = () => {
  pauseActive.value = !pauseActive.value;
  mediaRecorder.value?.pause();
};

/**
 * Stop the recording and save the video
 * save will be done in ons-stop event
 */
const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    recordingActive.value = false;
    pauseActive.value = false;
    videoTitle.value = generateVideoTitle();

    // Stop all tracks and remove them from the stream
    const tracks = mediaRecorder.value.stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
      mediaRecorder.value?.stream.removeTrack(track);
    });
  }
};

/**
 * Upload the new raw video in the smart video pipeline
 */
const uploadRawVideo = async () => {
  if (!videoFile.value) return;
  loading.value = true;
  // Upload the medium and receive an ID.
  await dataProvider.addVideoTask(videoFile.value);
  discardRecording();
  loading.value = false;
};

/**
 * Remove the video from the screen
 */
const discardRecording = () => {
  videoUrl.value = null;
  recordingActive.value = false;
  pauseActive.value = false;
  videoTitle.value = generateVideoTitle();
  videoFile.value = null;
};
</script>
