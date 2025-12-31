<script>
  export let checked = false;
</script>

<div class="auto-update-wrapper">
  <label class="switch">
    <input type="checkbox" bind:checked />
    <span class="slider"></span>
  </label>
  <span class="label-text">Auto Update</span>
</div>

<style>
  .auto-update-wrapper {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.9rem;
    color: #475569;
    font-weight: 500;
  }

  .label-text {
    position: relative;
    top: -5px; 
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: .3s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  input:checked + .slider {
    background-color: #3b82f6;
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #3b82f6;
  }
</style>