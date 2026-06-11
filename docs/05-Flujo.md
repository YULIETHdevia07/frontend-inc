### Flujo de notificaciones en frontend

```txt
1. El usuario inicia sesión.
2. AuthContext guarda el token y consulta el perfil.
3. Cuando existen token y usuario, AuthContext conecta Socket.IO.
4. NotificationBell usa useNotifications.
5. useNotifications carga las notificaciones por HTTP.
6. useNotifications escucha el evento new_notification por Socket.IO.
7. Cuando llega una nueva notificación, se agrega al listado.
8. El contador de no leídas se actualiza automáticamente.
9. El usuario puede marcar una o todas las notificaciones como leídas.
```

---

### Flujo del chat de PQR en frontend

```txt
1. El usuario abre el chat de una PQR.
2. usePqrChat carga el historial de mensajes por HTTP.
3. usePqrChat usa socketService para unir al usuario a la sala de la PQR.
4. El usuario envía un mensaje mediante sendPqrMessage.
5. El backend guarda el mensaje y emite new_pqr_message.
6. usePqrChat escucha el nuevo mensaje y lo agrega al historial del chat.
```

---

### Flujo de archivos adjuntos en el chat de PQR

```txt
1. El usuario selecciona una imagen o documento desde el chat.
2. PqrChatView envía el archivo al hook usePqrChat.
3. usePqrChat llama a sendPqrMessageWithAttachment().
4. pqrService envía el archivo al backend mediante FormData.
5. El backend guarda el archivo y crea el mensaje asociado.
6. El backend emite el evento new_pqr_message.
7. El frontend recibe el nuevo mensaje por Socket.IO.
8. PqrChatView muestra el mensaje con la imagen o documento adjunto.
```

---