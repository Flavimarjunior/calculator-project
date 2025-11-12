sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("calculatorproject.controller.View1", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter
                .getTarget("TargetView1")
                .attachDisplay(this.handleRouteMatched, this);
        },

        handleRouteMatched: function () {
            this.createModel();
        },

        createModel: function () {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel({
                    input1: '',
                    input2: '',
                    operador: '',
                    resultado: '',
                    display: '' // campo de display
                }),
                "oModelView1"
            );

            this.oViewModel = this.getView().getModel("oModelView1");
        },

        onPress(oEvent) {
            let oButton = oEvent.getSource();
            let sText = oButton.getText();
            let oModel = this.oViewModel;
            let sDisplay = oModel.getProperty("/display");

            debugger;

            // Limpar
            if (sText === "CE") {
                oModel.setProperty("/input1", "");
                oModel.setProperty("/input2", "");
                oModel.setProperty("/operador", "");
                oModel.setProperty("/resultado", "");
                oModel.setProperty("/display", "");
                return;
            }

            // Se for operador - CHAMANDO A NOVA FUNÇÃO
            if (["+", "-", "*", "÷"].includes(sText)) {
                this.handleOperator(sText, oModel, sDisplay); // ← TROQUEI ESTA LINHA
                return;
            }

            // Se for número
            oModel.setProperty("/display", sDisplay + sText);
        },

        handleOperator(sOperator, oModel, sDisplay) {
            // Remove espaços para análise
            let cleanDisplay = sDisplay.trim();

            // Verifica se o último caractere é um operador
            let lastChar = cleanDisplay.slice(-1);
            let secondLastChar = cleanDisplay.slice(-2, -1);

            // Se o último caractere já é um operador, substitui
            if (["+", "-", "*", "÷"].includes(lastChar)) {
                // Remove o último operador e adiciona o novo
                let newDisplay = cleanDisplay.slice(0, -1) + sOperator;
                oModel.setProperty("/display", newDisplay + " ");
            }
            // Caso especial: se for "-" após outro operador (números negativos)
            else if (sOperator === "-" && ["+", "-", "*", "÷"].includes(lastChar)) {
                oModel.setProperty("/display", sDisplay + " " + sOperator);
            }
            else {
                // Adiciona o operador normalmente
                oModel.setProperty("/display", sDisplay + " " + sOperator + " ");
            }

            oModel.setProperty("/operador", sOperator);
        },

        onCalculate() {
            let oModel = this.oViewModel;
            let sDisplay = oModel.getProperty("/display");

            try {
                // Limpa espaços extras e substitui "÷" por "/"
                let expression = sDisplay.replace(/\s+/g, '').replace(/÷/g, "/");

                // Calcular o resultado
                let result = eval(expression); // Não usar em produção sem sanitização

                oModel.setProperty("/resultado", result);
                oModel.setProperty("/display", result.toString());
            } catch (err) {
                MessageToast.show("Expressão inválida");
            }
        }
    });
});
