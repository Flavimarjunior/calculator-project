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

            // Se for operador
            if (["+", "-", "*", "÷"].includes(sText)) {
                oModel.setProperty("/operador", sText);
                oModel.setProperty("/display", sDisplay + " " + sText + " ");
                return;
            }

            // Se for número
            oModel.setProperty("/display", sDisplay + sText);
        },

        onCalculate() {
            let oModel = this.oViewModel;
            let sDisplay = oModel.getProperty("/display");

            try {
                // Substituir "÷" por "/"
                let expression = sDisplay.replace(/÷/g, "/");

                // Calcular o resultado
                let result = eval(expression); // Não usar em produção sem sanitização

                oModel.setProperty("/resultado", result);
                oModel.setProperty("/display", result);
            } catch (err) {
                MessageToast.show("Expressão inválida");
            }
        }
    });
});
