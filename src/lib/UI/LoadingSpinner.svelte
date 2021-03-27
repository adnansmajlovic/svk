<style>
  .lds-hourglass {
    display: inline-block;
    position: relative;
    width: 50px;
    height: 50px;
  }
  .lds-hourglass:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: 18px solid #cf0056;
    border-color: #cf0056 transparent #cf0056 transparent;
    animation: lds-hourglass 1.2s infinite;
  }
  @keyframes lds-hourglass {
    0% {
      transform: rotate(0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    50% {
      transform: rotate(900deg);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    100% {
      transform: rotate(1800deg);
    }
  }
</style>

<!-- <div class="loading">
  <p>Loading...</p>
</div> -->

<div class="lds-hourglass" />
