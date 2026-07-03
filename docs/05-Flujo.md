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

### Flujo de requisiciones de personal en frontend

```txt
1. El usuario con rol JEFE_AREA ingresa al módulo de Talento Humano.
2. El usuario abre la página para crear una requisición de personal.
3. useCreatePersonnelRequisition carga áreas, cargos y ciudades por HTTP.
4. El usuario completa el formulario de requisición.
5. El hook valida los campos obligatorios según el tipo de contrato seleccionado.
6. El frontend envía la requisición al backend mediante createPersonnelRequisition().
7. El backend guarda la requisición y registra automáticamente la aprobación del JEFE_AREA.
8. El backend notifica al siguiente responsable del flujo.
9. El frontend muestra un mensaje de confirmación al usuario.
```

---

### Flujo de aprobación de requisiciones en frontend

```txt
1. El usuario ingresa a la página de requisiciones de personal.
2. usePersonnelRequisitions carga las requisiciones disponibles por HTTP.
3. El backend devuelve solo las requisiciones que corresponden al rol del usuario.
4. PersonnelRequisitions muestra el listado usando PersonnelRequisitionListItem.
5. Si el usuario tiene permiso para decidir, se muestran los botones Aprobar y Rechazar.
6. El usuario selecciona una acción.
7. ConfirmActionDialog muestra el modal de confirmación.
8. Si la acción es rechazo, el usuario debe ingresar un comentario.
9. usePersonnelRequisitions envía la decisión al backend mediante decidePersonnelRequisition().
10. El backend registra la decisión y notifica al siguiente responsable del flujo.
11. El frontend recarga el listado y muestra el mensaje correspondiente.
```

---

### Flujo de confirmación de contratación en frontend

```txt
1. El Analista de Talento Humano ingresa al listado de requisiciones.
2. usePersonnelRequisitions carga las requisiciones pendientes de confirmación.
3. Cuando una requisición está en estado PENDIENTE_CONFIRMACION_TALENTO_HUMANO, se muestra el botón Confirmar contratación.
4. El usuario abre el modal PersonnelHiringConfirmationDialog.
5. El modal muestra los datos base de la requisición y permite confirmar el tipo de contrato y salario aprobado.
6. El hook valida que los campos requeridos estén completos.
7. usePersonnelRequisitions envía la confirmación al backend mediante createPersonnelHiringConfirmation().
8. El backend guarda la confirmación de contratación.
9. El backend registra automáticamente la aprobación del Analista de Talento Humano.
10. El backend notifica al Jefe de Talento Humano.
11. El frontend cierra el modal, recarga el listado y muestra el mensaje de éxito.
```

---

### Flujo de aprobación final de Talento Humano en frontend

```txt
1. El Jefe de Talento Humano ingresa al listado de requisiciones.
2. usePersonnelRequisitions carga las requisiciones pendientes de aprobación final.
3. Cuando una requisición está en estado PENDIENTE_JEFE_TALENTO_HUMANO, se muestran las acciones Aprobar TH y Rechazar TH.
4. El usuario selecciona una acción.
5. ConfirmActionDialog muestra el modal de confirmación.
6. Si la acción es rechazo, el usuario debe ingresar un comentario.
7. usePersonnelRequisitions envía la decisión al backend mediante decidePersonnelHiringConfirmation().
8. El backend registra la aprobación o rechazo de la confirmación de contratación.
9. Si la decisión es aprobada, la requisición queda finalizada como APROBADA.
10. Si la decisión es rechazada, la requisición queda finalizada como RECHAZADA.
11. El frontend recarga el listado y muestra el mensaje correspondiente.
```

---

### Flujo de componentes del módulo de Talento Humano

```txt
1. PersonnelRequisitions representa la página principal del listado.
2. usePersonnelRequisitions maneja la lógica, estados, peticiones y decisiones.
3. PersonnelRequisitionListItem muestra cada requisición en formato de lista.
4. ActionButton muestra botones reutilizables con iconos, carga y diseño responsive.
5. ConfirmActionDialog muestra confirmaciones para aprobar, rechazar o cancelar acciones.
6. PersonnelHiringConfirmationDialog muestra el formulario de confirmación de contratación.
7. CustomSnackbar muestra mensajes de éxito.
8. Alert muestra errores generales cuando ocurre un problema.
```

---

### Flujo de roles en requisiciones de personal

```txt
1. JEFE_AREA crea la requisición de personal.
2. El sistema registra automáticamente la aprobación del JEFE_AREA.
3. JEFE_DEPARTAMENTO revisa y aprueba o rechaza la requisición.
4. GERENTE_GENERAL revisa y aprueba o rechaza la requisición.
5. ANALISTA_TALENTO_HUMANO registra la confirmación final de contratación.
6. El sistema registra automáticamente la aprobación del Analista de Talento Humano.
7. JEFE_TALENTO_HUMANO aprueba o rechaza la confirmación de contratación.
8. Si todos aprueban, la requisición finaliza como APROBADA.
9. Si algún responsable rechaza, la requisición finaliza como RECHAZADA.
10. Si algún responsable cancela, la requisición finaliza como CANCELADA.
```

---

### Flujo de estados calculados de una requisición

```txt
1. El backend no guarda el estado final directamente en la tabla principal.
2. El backend consulta las aprobaciones registradas de la requisición.
3. El helper calculatePersonnelRequisitionStatus revisa el paso pendiente.
4. Si falta la aprobación del Jefe de Departamento, el estado es PENDIENTE_JEFE_DEPARTAMENTO.
5. Si falta la aprobación de Gerencia General, el estado es PENDIENTE_GERENCIA_GENERAL.
6. Si todas las aprobaciones de requisición están completas, pasa a PENDIENTE_CONFIRMACION_TALENTO_HUMANO.
7. Si ya existe confirmación de contratación, se revisan las aprobaciones de Talento Humano.
8. Si falta la aprobación del Jefe de Talento Humano, el estado es PENDIENTE_JEFE_TALENTO_HUMANO.
9. Si todos los pasos están aprobados, el estado calculado es APROBADA.
10. Si existe una decisión RECHAZADA o CANCELADA, ese estado tiene prioridad.
```

---

### Nota sobre el cálculo del estado

```txt
El estado de la requisición se calcula a partir de las aprobaciones registradas.
Esto evita duplicar información en la base de datos y permite conocer el avance real del proceso según los pasos aprobados o pendientes.
```