import { closeIncidentModal } from "../../views/close-incident-modal.ts";

const closeIncidentHandler = async (
  client: any,
  action: any,
  body: any,
  token: string,
) => {
  console.log("hit close incident statement");
  //get the modal view from the views folder
  const ModalView = await closeIncidentModal(action.value);

  //open the modal with the view which we created above
  await client.views.open({
    trigger_id: body.trigger_id,
    view: ModalView,
  });
};

export { closeIncidentHandler };
