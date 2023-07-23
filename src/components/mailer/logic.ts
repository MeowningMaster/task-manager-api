import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import nodemailer from 'nodemailer'

export const Mailer = ioc.add([Config], async (config) => {
    return nodemailer.createTransport(config.mailer)
})
