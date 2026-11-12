const mongoose = require('mongoose');

const esObjetoIdValido = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

const validarReferencia  = (Modelo, campo, origen) => {
    if (origen === undefined) {
        origen = 'body';
    }

    return async function(req, res, next) {
        try {
            const id = req[origen][campo];

            if (id === undefined || id === null) {
                return next();
            }

            let ids = id;

            if (!Array.isArray(id)) {
                ids = [id];
            }

            for (let i = 0; i < ids.length; i++) {
                if (!esObjetoIdValido(ids[i])) {
                    return res.status(400).json({
                        message: `El identificador de ${campo} no tiene un formato válido.`
                    });
                }
            }

            const documentos = await Modelo.find({
                _id: { $in: ids }
            });

            for (let i = 0; i < ids.length; i++) {
                let encontrado = false;

                for (let j = 0; j < documentos.length; j++) {
                    if (ids[i] === documentos[j]._id.toString()) {
                        encontrado = true;
                    }
                }
                
                if (!encontrado) {
                    return res.status(404).json({
                        message: `No se encontró ningún registro asociado al ${campo} proporcionado.`
                    })
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = validarReferencia;