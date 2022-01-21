import { createBrowserHistory } from 'history';

export const categoriesFromEngToRus = (engCat) => {
    switch (engCat) {
        case "New":
            return "Новинки";
        case "Bouquet":
            return "Букеты";
        case "Basket":
            return "Корзинки";
        default:
            return "";
    }
}

export const categoriesFromRusToEng = (rusCat) => {
    switch (rusCat) {
        case "Новинки":
            return "New";
        case "Букеты":
            return "Bouquet";
        case "Корзинки":
            return "Basket";
        default:
            return "";
    }
}

export const history = createBrowserHistory();