import Client from "msgroom";

export type DefaultFileExport = typeof Client.prototype.commands | (typeof Client.prototype.commands[string]);