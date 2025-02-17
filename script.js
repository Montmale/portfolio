// Set effect velocity in ms
var velocity = 50; // Incrementato per ridurre la velocità dell'effetto

var shuffleElement = $(".shuffle");

// Memorizza il testo originale
$.each(shuffleElement, function (index, item) {
  $(item).attr("data-text", $(item).text());
});

// Funzione di shuffle
var shuffle = function (o) {
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
};

// Funzione per mescolare il testo
var shuffleText = function (element, originalText) {
  var elementTextArray = [];
  var randomText = [];

  for (var i = 0; i < originalText.length; i++) {
    elementTextArray.push(originalText.charAt([i]));
  }

  var repeatShuffle = function (times, index) {
    if (index == times) {
      element.text(originalText);
      return;
    }

    setTimeout(function () {
      randomText = shuffle(elementTextArray);
      for (var i = 0; i < index; i++) {
        randomText[i] = originalText[i];
      }
      randomText = randomText.join("");
      element.text(randomText);
      index++;
      repeatShuffle(times, index);
    }, velocity);
  };

  var timesToShuffle = Math.floor(originalText.length / 2); // Riduce il numero di ripetizioni

  repeatShuffle(timesToShuffle, 0);
};

// Funzione per gestire lo shuffle al mouseenter
shuffleElement.mouseenter(function () {
  shuffleText($(this), $(this).data("text"));
});

// Funzione per ripristinare il testo originale al mouseleave
shuffleElement.mouseleave(function () {
  var originalText = $(this).data("text");
  $(this).text(originalText);
});

// Aggiungi l'evento mouseenter per il contenitore .flex-container1
$(".flex-container1").mouseenter(function () {
  // Per ogni elemento .shuffle dentro il contenitore, esegui lo shuffle
  $(this)
    .find(".shuffle")
    .each(function () {
      var text = $(this).data("text"); // Ottieni il testo originale
      shuffleText($(this), text); // Esegui lo shuffle
    });

  // Per ogni elemento con la classe .no-shuffle dentro il contenitore, cambia il testo in "(+)"
  $(this)
    .find(".no-shuffle")
    .each(function () {
      $(this).text("(+)"); // Cambia il testo in "(+)"
    });
});

// Aggiungi l'evento mouseleave per ripristinare il testo originale
$(".flex-container1").mouseleave(function () {
  // Per ogni elemento .shuffle dentro il contenitore, ripristina il testo originale
  $(this)
    .find(".no-shuffle")
    .each(function () {
      var originalText = $(this).data("text"); // Ripristina il testo originale
      $(this).text(originalText); // Imposta il testo originale
    });
});

// PIXELATE EFFECT ON HOVER
document.querySelectorAll(".indice").forEach((container) => {
  const canvas = container.querySelector(".canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const image = container.querySelector(".pixel-image");

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    initialPixelation();
    animatePixelation();
  };

  function pixelate(imageData, pixelSize) {
    const { data, width, height } = imageData;
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const red = data[(width * y + x) * 4];
        const green = data[(width * y + x) * 4 + 1];
        const blue = data[(width * y + x) * 4 + 2];
        for (let n = 0; n < pixelSize; n++) {
          for (let m = 0; m < pixelSize; m++) {
            if (x + m < width && y + n < height) {
              data[(width * (y + n) + (x + m)) * 4] = red;
              data[(width * (y + n) + (x + m)) * 4 + 1] = green;
              data[(width * (y + n) + (x + m)) * 4 + 2] = blue;
            }
          }
        }
      }
    }
    return imageData;
  }

  function initialPixelation() {
    const maxPixelSize = 20;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixelatedData = pixelate(imageData, maxPixelSize);
    context.putImageData(pixelatedData, 0, 0);
  }

  function updateCanvas(pixelSize) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (pixelSize > 1) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixelatedData = pixelate(imageData, pixelSize);
      context.putImageData(pixelatedData, 0, 0);
    }
  }

  function animatePixelation() {
    const maxPixelSize = 20;
    const minPixelSize = 1;
    const stepSize = -3;

    container.addEventListener("mouseover", () => {
      let currentPixelSize = maxPixelSize;
      const interval = setInterval(() => {
        if (currentPixelSize > minPixelSize) {
          updateCanvas(currentPixelSize);
          currentPixelSize += stepSize;
        } else {
          clearInterval(interval);
        }
      }, 80);
    });
  }

  if (image.complete) {
    image.onload();
  }
});

function scrollDown() {
  // Scorri dolcemente alla prossima sezione
  window.scrollBy({
    top: window.innerHeight, // Scorri esattamente un'altezza pari alla finestra
    behavior: "smooth", // Aggiungi un effetto di scroll fluido
  });
}
