const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Model de usuarios
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')



// Autenticação de usuário
module.exports = function(passport) { 
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {  // Passando parâmetros para a autenticação
        Usuario.findOne({email: email}).then((usuario) => {                                                     // Procura o email no banco de dados
            if(!usuario) {                                                                                      // Se não tiver o email
                return done(null, false, {message: 'Email ou senha incorretos'})                                // Retornaá o erro, pois não consta o email cadastrado no banco de dados
            }
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {                                             // Utiliza o 'bcrypt' para comparar os hash (senhas protegidas)
                if(batem) {                                                                                     // Se os hashs comparados forem iguais
                    return done(null, usuario)                                                                  // Prossiga com o login
                }else {                                                                                         // Se os hashs forem diferentes
                    return done(null, false, {message: 'Senha incorreta'})                                      // Retornará um erro de senha, pois o email consta, mas a senha equivalente aquele email esta errado
                }
            })
        })
    }))


    passport.serializeUser((usuario, done) =>{                                                                  // Salvar dados do usuário em uma seção
        done(null, usuario.id)                                                                                     
    })

    passport.deserializeUser((id,done)=>{
        Usuario.findById(id).then((usuario)=>{
            done(null,usuario)
        }).catch((err)=>{
             done (null,false,{message:'algo deu errado'})
        })
    
    
        })
}